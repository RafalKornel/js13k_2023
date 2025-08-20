import { Anchor, Direction, Interaction, Vec2 } from "../types";
import { Assets, Colors } from "./types";

import {
  CanvasImageRenderer,
  ICanvasImageRenderer,
} from "./canvas-image-renderer";
import { DrawTextParams, ITextRenderer, TextRenderer } from "./text-renderer";
import { IRenderer } from "./interfaces";

export type RenderEngineParams = {
  width: number;
  height: number;
};

export abstract class CanvasRenderer implements IRenderer {
  private _raf?: number;

  protected ctx: CanvasRenderingContext2D;

  protected width: number;
  protected height: number;

  private _canvasImageRenderer: ICanvasImageRenderer;

  private _textRenderer: ITextRenderer;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(
    gameCanvas: HTMLCanvasElement,
    textCanvas: HTMLCanvasElement,
    colors: Colors,
    assets: Assets,
    options: RenderEngineParams
  ) {
    const { height, width } = options;

    this.height = height;
    this.width = width;

    gameCanvas.width = this.width;
    gameCanvas.height = this.height;

    const gameCtx = gameCanvas.getContext("2d");

    if (!gameCtx) {
      throw new Error("Your browser doesn't support canvas");
    }

    // ctx.imageSmoothingEnabled = false;

    this.ctx = gameCtx;

    const scale = gameCanvas.clientWidth / this.width;

    this._textRenderer = new TextRenderer(
      textCanvas,
      gameCanvas.clientWidth,
      gameCanvas.clientHeight,
      scale
    );

    this._canvasImageRenderer = new CanvasImageRenderer(
      this.ctx,
      colors,
      assets
    );
  }

  drawText(
    text: string,
    size: "m" | "l",
    gameX: number,
    gameY: number,
    options?: DrawTextParams
  ) {
    this._textRenderer.drawText(text, size, gameX, gameY, options);
  }

  dialogueModal(left: string[], options: Interaction[]) {
    this._textRenderer.dialogueModal(left, options);
  }

  renderImage(
    assetKey: string,
    pos: Vec2,
    dir: Direction = "r",
    anchor: Anchor = "center"
  ) {
    this._canvasImageRenderer.renderImage(assetKey, pos, dir, anchor);
  }

  renderRectFill = ({
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

  renderRect = ({
    color,
    dim,
    pos,
    anchor = "center",
    lineWidth = 2,
  }: {
    pos?: Vec2;
    dim?: Vec2;
    color: string;
    anchor?: Anchor;
    lineWidth?: number;
  }) => {
    this.ctx.fillStyle = color;

    const x = pos?.[0] || 0;
    const y = pos?.[1] || 0;

    const w = dim ? Math.min(dim[0], this.width) : this.width;

    const h = dim ? Math.min(dim[1], this.height) : this.height;

    const xOffset = anchor === "center" ? w / 2 : 0;
    const yOffset = anchor === "center" ? h / 2 : 0;

    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    this.ctx.rect(x - xOffset, y - yOffset, w, h);

    this.ctx.stroke();
  };

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

    this._textRenderer.clear();
  }
}
