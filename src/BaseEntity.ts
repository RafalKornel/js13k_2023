import { Vec2, Bounds, CollisionType } from "./types";

export abstract class BaseEntity {
  pos?: Vec2;
  dim?: Vec2;
  parentBounds?: Bounds;
  // zIndex?: number;
  children?: BaseEntity[];
  collision?: CollisionType;
  render?(ctx: CanvasRenderingContext2D): void;
  update?(...args: any[]): void;

  get globalPos(): Vec2 {
    if (!this.pos || !this.dim) {
      console.error(this);
      throw new Error(`Error: ${(this.pos, this.dim, this.parentBounds)}`);
    }

    if (!this.parentBounds) return this.pos;

    return [
      this.pos[0] + this.parentBounds[0],
      this.pos[1] + this.parentBounds[1],
    ];
  }
}
