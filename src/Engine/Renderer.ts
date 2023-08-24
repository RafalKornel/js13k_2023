import { TEXT_CONFIG } from "./config";
import { Anchor, Vec2 } from "./types";

import { CustomImageDecoder } from "./ImageDecoder";

import { mult, subtract } from "./utils";
import { IMAGES_MAP, ImageId, colors } from "../assets";

export type RenderEngineParams = {
  width?: number;
  height?: number;
};

export abstract class Renderer {
  protected ctx: CanvasRenderingContext2D;
  protected textCtx: CanvasRenderingContext2D;

  private _sideCtx: CanvasRenderingContext2D;
  private _sideCanvas: HTMLCanvasElement;

  protected width: number;
  protected height: number;

  private _imageDecoder: CustomImageDecoder;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(
    readonly gameCanvas: HTMLCanvasElement,
    readonly textCanvas: HTMLCanvasElement,
    options: RenderEngineParams = {}
  ) {
    const { height = 640, width = 640 } = options;

    this.height = height;
    this.width = width;

    gameCanvas.width = this.width;
    gameCanvas.height = this.height;

    textCanvas.width = gameCanvas.clientWidth;
    textCanvas.height = gameCanvas.clientHeight;

    const gameCtx = gameCanvas.getContext("2d");
    const textCtx = textCanvas.getContext("2d");

    const sideCanvas = document.createElement("canvas");
    const sideContext = sideCanvas.getContext("2d");

    if (!gameCtx || !textCtx || !sideContext) {
      throw new Error("Your browser doesn't support canvas");
    }

    this._sideCanvas = sideCanvas;
    this._sideCtx = sideContext;

    // ctx.imageSmoothingEnabled = false;

    this.ctx = gameCtx;

    this.textCtx = textCtx;

    this._imageDecoder = new CustomImageDecoder(colors);
  }

  renderImage(imageId: ImageId, pos: Vec2) {
    const size: Vec2 = [8, 8];

    const compressedImage = IMAGES_MAP[imageId];

    const image = this._imageDecoder.decompressImage(
      compressedImage,
      ...size,
      4
    );

    const imgData = new ImageData(image, ...size);

    const translatedSize = subtract(pos, mult(size, 0.5));

    this._sideCtx.clearRect(
      0,
      0,
      this._sideCanvas.width,
      this._sideCanvas.height
    );

    this._sideCtx.putImageData(imgData, 0, 0);

    const i = new Image(...size);

    i.src = this._sideCanvas.toDataURL();
    this.ctx.drawImage(i, ...translatedSize);
  }

  renderRect = ({
    color,
    dim,
    pos,
    anchor = "center",
  }: {
    pos?: Vec2;
    dim?: Vec2;
    color: string;
    anchor?: Anchor;
  }) => {
    this.ctx.fillStyle = color;

    const x = pos?.[0] || 0;
    const y = pos?.[1] || 0;

    const w = dim ? Math.min(dim[0], this.width) : this.width;

    const h = dim ? Math.min(dim[1], this.height) : this.height;

    const xOffset = anchor === "center" ? w / 2 : 0;
    const yOffset = anchor === "center" ? h / 2 : 0;

    this.ctx.fillRect(x - xOffset, y - yOffset, w, h);
  };

  get scale() {
    return this.textCanvas.width / this.gameCanvas.width;
  }

  drawText(text: string, gameX: number, gameY: number): [w: number, h: number] {
    this.textCtx.font = `${TEXT_CONFIG.fontSize}px ${TEXT_CONFIG.fontFace}`;

    const textWidth =
      this.textCtx.measureText(text).width + TEXT_CONFIG.marginX * 2;
    const lineHeight = TEXT_CONFIG.fontSize * TEXT_CONFIG.lineHeight;

    this.textCtx.textAlign = TEXT_CONFIG.textAlign;

    this.textCtx.textBaseline = TEXT_CONFIG.textBaseline;

    const textX = gameX * this.scale;
    const textY = gameY * this.scale;

    this.textCtx.fillText(text, textX, textY);

    this.textCtx.strokeRect(
      textX - TEXT_CONFIG.marginX,
      textY,
      textWidth,
      lineHeight
    );

    return [textWidth, lineHeight];
  }

  public start() {
    this.loopWrapper();
  }

  private loopWrapper() {
    this.clear();

    this.loop();

    requestAnimationFrame(() => this.loopWrapper());
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
  }
}
