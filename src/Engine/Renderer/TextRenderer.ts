import { SCREEN_HEIGHT, TEXT_CONFIG } from "../config";
import { Interaction, TextSize, Vec2 } from "../types";
import { add, convertTileVecToGlobal, mult, subtract } from "../utils";
import { CONFIG } from "../config";

export type DrawTextParams = {
  color?: string;
  backgroundColor?: string;
  anchor?: "left" | "center" | "right";
};

export interface ITextRenderer {
  drawText(
    text: string,
    size: "m" | "l",
    gameX: number,
    gameY: number,
    options?: DrawTextParams
  ): void;

  dialogueModal(left: string[], options: Interaction[]): void;

  clear(): void;
}

export class TextRenderer implements ITextRenderer {
  protected textCtx: CanvasRenderingContext2D;

  constructor(
    readonly textCanvas: HTMLCanvasElement,
    readonly width: number,
    readonly height: number,
    readonly scale: number
  ) {
    textCanvas.width = width;
    textCanvas.height = height;

    this.textCtx = textCanvas.getContext("2d")!;
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

    const xOff =
      anchor === "center" ? textWidth / 2 : anchor === "right" ? textWidth : 0;

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
    const size = mult(convertTileVecToGlobal([10, 8]), this.scale);

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

  clear() {
    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
  }

  private setupTextProperties(size: TextSize, color: string) {
    const fontSize = TEXT_CONFIG.fontSize[size];

    this.textCtx.font = `${fontSize}vh ${TEXT_CONFIG.fontFace}`;

    this.textCtx.textAlign = TEXT_CONFIG.textAlign;

    this.textCtx.textBaseline = TEXT_CONFIG.textBaseline;

    this.textCtx.fillStyle = color;

    const lineHeight =
      TEXT_CONFIG.lineHeight * SCREEN_HEIGHT * this.scale * (fontSize / 100);

    return [lineHeight];
  }
}
