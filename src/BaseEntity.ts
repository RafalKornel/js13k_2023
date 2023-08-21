import { Vec2, Bounds, CollisionType } from "./types";

export interface BaseEntity {
  pos: Vec2;
  dim: Vec2;
  collisionType: CollisionType;
  parentBounds?: Bounds;
  // zIndex?: number;
  children?: BaseEntity[];
  render?(ctx: CanvasRenderingContext2D): void;
  update?(...args: any[]): void;
}
