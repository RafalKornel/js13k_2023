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

  // This cache is potentially leaky, but it's fine in this project, because
  // we only render about 50 different assets, which is not a problem.
  // But if this was used in larger project (which I don't recommend),
  // then it should be cleared every scene change.
  private _imagesCache: Map<ImageCacheKey, [HTMLImageElement, Vec2]>;

  private _sideCtx: CanvasRenderingContext2D;
  private _sideCanvas: HTMLCanvasElement;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly colors: Uint8ClampedArray,
    readonly assets: Assets
  ) {
    this._imageDecoder = new CustomImageDecoder(colors, assets);
    this._imagesCache = new Map();

    const sideCanvas = document.createElement("canvas");
    const sideContext = sideCanvas.getContext("2d");

    this._sideCanvas = sideCanvas;
    this._sideCtx = sideContext!;
  }

  renderImage(imageId: number, pos: Vec2, dir: Direction, anchor: Anchor) {
    const cacheKey = getImageCacheKey(imageId, dir);

    let [cachedImage, cachedSize] = this._imagesCache.get(cacheKey) || [];

    if (!cachedImage || !cachedSize) {
      const [imageData, size] = this._imageDecoder.getImageData(imageId, dir);

      const imgData = new ImageData(imageData, ...size);

      this._sideCtx.clearRect(
        0,
        0,
        this._sideCanvas.width,
        this._sideCanvas.height
      );

      this._sideCtx.putImageData(imgData, 0, 0);

      const image = new Image(...size);

      image.src = this._sideCanvas.toDataURL();

      cachedImage = image;
      cachedSize = size;

      this._imagesCache.set(cacheKey, [cachedImage, size]);
    }

    const translatedPos =
      anchor === "center" ? subtract(pos, mult(cachedSize, 0.5)) : pos;

    this.ctx.drawImage(cachedImage, translatedPos[0], translatedPos[1]);
  }
}
