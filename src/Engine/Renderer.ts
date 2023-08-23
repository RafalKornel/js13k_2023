import { Anchor, Vec2 } from "./types";

export type RenderEngineParams = {
  width?: number;
  height?: number;
};

export abstract class Renderer {
  protected ctx: CanvasRenderingContext2D;

  protected width: number;
  protected height: number;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(canvas: HTMLCanvasElement, options: RenderEngineParams = {}) {
    const { height = 640, width = 640 } = options;

    this.height = height;
    this.width = width;

    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Your browser doesn't support canvas");
    }

    // ctx.imageSmoothingEnabled = false;

    this.ctx = ctx;
  }

  renderRect = ({
    color,
    dim,
    pos,
    dimPecent, // obsolete?
    anchor = "center",
  }: {
    pos?: Vec2;
    dim?: Vec2;
    dimPecent?: Vec2;
    color: string;
    anchor?: Anchor;
  }) => {
    this.ctx.fillStyle = color;

    // const [x = 0, y = 0, w = this.width, h = this.height] = bounds || [];

    const x = pos?.[0] || 0;
    const y = pos?.[1] || 0;

    const w = dim
      ? Math.min(dim[0], this.width)
      : dimPecent
      ? dimPecent[0] * this.width
      : this.width;

    const h = dim
      ? Math.min(dim[1], this.height)
      : dimPecent
      ? dimPecent[1] * this.height
      : this.height;

    const xOffset = anchor === "center" ? w / 2 : 0;
    const yOffset = anchor === "center" ? h / 2 : 0;

    this.ctx.fillRect(x - xOffset, y - yOffset, w, h);
  };

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
  }
}
