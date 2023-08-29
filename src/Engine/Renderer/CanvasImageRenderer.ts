import { CustomImageDecoder } from "./ImageDecoder";
import { Anchor, Direction, Vec2 } from "../types";
import { Assets, ImageCacheKey } from "./types";
import { subtract, mult } from "../utils";
import { getImageCacheKey } from "./utils";

export interface ICanvasImageRenderer {
  renderImage(imageId: number, pos: Vec2, dir: Direction, anchor: Anchor): void;
}

export class CanvasImageRenderer implements ICanvasImageRenderer {
  private _imageDecoder: CustomImageDecoder;

  private _canvasUrlCache: Map<ImageCacheKey, string>;

  private _sideCtx: CanvasRenderingContext2D;
  private _sideCanvas: HTMLCanvasElement;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly colors: Uint8ClampedArray,
    readonly assets: Assets
  ) {
    this._imageDecoder = new CustomImageDecoder(colors, assets);
    this._canvasUrlCache = new Map();

    const sideCanvas = document.createElement("canvas");
    const sideContext = sideCanvas.getContext("2d");

    this._sideCanvas = sideCanvas;
    this._sideCtx = sideContext!;
  }

  renderImage(imageId: number, pos: Vec2, dir: Direction, anchor: Anchor) {
    const cacheKey = getImageCacheKey(imageId, dir);

    const cachedSrc = this._canvasUrlCache.get(cacheKey);

    const [imageData, size] = this._imageDecoder.getImageData(imageId, dir);

    const translatedPos =
      anchor === "center" ? subtract(pos, mult(size, 0.5)) : pos;

    const image = new Image(...size);

    if (cachedSrc) {
      image.src = cachedSrc;
    } else {
      const imgData = new ImageData(imageData, ...size);

      this._sideCtx.clearRect(
        0,
        0,
        this._sideCanvas.width,
        this._sideCanvas.height
      );

      this._sideCtx.putImageData(imgData, 0, 0);

      image.src = this._sideCanvas.toDataURL();

      this._canvasUrlCache.set(cacheKey, image.src);
    }

    this.ctx.drawImage(image, translatedPos[0], translatedPos[1]);
  }
}
