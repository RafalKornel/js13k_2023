import { TEXT_CONFIG } from "./config";
import {
  Anchor,
  Direction,
  ImageMetaData,
  Interaction,
  TextSize,
  Vec2,
} from "./types";

import { CustomImageDecoder } from "./ImageDecoder";

import {
  add,
  convertTileVecToGlobal,
  flipImage,
  mult,
  rotate90Deg,
  subtract,
} from "./utils";
import { colors } from "../assets";
import { CONFIG } from "./config";

type DrawTextParams = {
  color?: string;
  backgroundColor?: string;
  anchor?: "left" | "center";
};

export type RenderEngineParams = {
  width?: number;
  height?: number;
};

export abstract class Renderer {
  private _raf?: number;

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

  renderImage(
    imageData: ImageMetaData,
    pos: Vec2,
    dir: Direction = "r",
    anchor: Anchor = "center"
  ) {
    const { s } = imageData;

    const adjustedImageData =
      dir === "l"
        ? flipImage(imageData.data, s[0])
        : dir === "t"
        ? rotate90Deg(imageData.data, s[0])
        : imageData.data;

    const image = this._imageDecoder.decompressImage(
      adjustedImageData,
      ...s,
      4
    );

    const imgData = new ImageData(image, ...s);

    const translatedPos =
      anchor === "center" ? subtract(pos, mult(s, 0.5)) : pos;

    this._sideCtx.clearRect(
      0,
      0,
      this._sideCanvas.width,
      this._sideCanvas.height
    );

    this._sideCtx.putImageData(imgData, 0, 0);

    const i = new Image(...s);

    i.src = this._sideCanvas.toDataURL();

    this.ctx.drawImage(i, translatedPos[0], translatedPos[1]);
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

  drawText(
    text: string,
    size: "m" | "l",
    gameX: number,
    gameY: number,
    options?: DrawTextParams
  ) {
    const {
      color = TEXT_CONFIG.color,
      anchor = "center",
      backgroundColor,
    } = options || {};

    const [lineHeight] = this.setupTextProperties(size, color);

    const textWidth = this.textCtx.measureText(text).width;

    const xOff = anchor === "center" ? textWidth / 2 : 0;

    const textX = gameX * this.scale - xOff;
    const textY = gameY * this.scale;

    if (backgroundColor) {
      this.textCtx.fillStyle = backgroundColor;
      this.textCtx.fillRect(
        textX - TEXT_CONFIG.margin,
        textY - TEXT_CONFIG.margin,
        textWidth + TEXT_CONFIG.margin * 2,
        lineHeight + TEXT_CONFIG.margin
      );
      this.textCtx.fillStyle = color;
    }

    this.textCtx.fillText(text, textX, textY);
  }

  dialogueModal(left: string[], options: Interaction[]) {
    const size = mult(convertTileVecToGlobal([8, 6]), this.scale);

    const pos = mult(
      convertTileVecToGlobal([CONFIG.width / 2, CONFIG.height / 2]),
      this.scale
    );

    const halfOffset: Vec2 = [size[0] / 2, 0];

    const textBox = subtract(pos, mult(size, 0.5));

    const textBoxWithMargin = add(textBox, [
      TEXT_CONFIG.margin,
      TEXT_CONFIG.margin,
    ]);

    const ctx = this.textCtx;

    ctx.strokeStyle = TEXT_CONFIG.borderColor;
    ctx.fillStyle = TEXT_CONFIG.borderBackground;

    ctx.lineWidth = 2;

    ctx.strokeRect(...textBox, ...size);
    ctx.fillRect(...textBox, ...size);

    ctx.strokeRect(...add(textBox, halfOffset), 0, size[1]);

    const [lineHeight] = this.setupTextProperties("m", TEXT_CONFIG.color);

    const lines = left.map((value) => value.split("\n")).flat();

    lines.forEach((line, i) => {
      ctx.fillText(line, ...add(textBoxWithMargin, [0, lineHeight * i]));
    });

    options.forEach((line, i) => {
      ctx.fillText(
        `${line.key}: ${line.text}`,
        ...add(textBoxWithMargin, [size[0] / 2, lineHeight * i])
      );
    });

    ctx.fillText(
      "x: close",
      ...add(textBoxWithMargin, [size[0] / 2, size[1] - lineHeight * 2])
    );
  }

  private setupTextProperties(size: TextSize, color: string) {
    const fontSize = TEXT_CONFIG.fontSize[size];

    this.textCtx.font = `${fontSize}px ${TEXT_CONFIG.fontFace}`;

    this.textCtx.textAlign = TEXT_CONFIG.textAlign;

    this.textCtx.textBaseline = TEXT_CONFIG.textBaseline;

    this.textCtx.fillStyle = color;

    const lineHeight = TEXT_CONFIG.lineHeight * fontSize;

    return [lineHeight];
  }

  public start() {
    this._raf = this.loopWrapper();
  }

  private loopWrapper(): number {
    this.clear();

    this.loop();

    return requestAnimationFrame(() => this.loopWrapper());
  }

  public stop() {
    if (!this._raf) {
      return;
    }

    cancelAnimationFrame(this._raf);
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
  }
}
