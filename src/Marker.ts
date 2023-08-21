import { CONFIG } from "./config.ts";
import { Bounds, CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { renderBox } from "./renderBox.ts";
import { ChamberKey } from "./Chamber.ts";

export class Marker implements BaseEntity {
  pos: Vec2;
  dim: Vec2;
  collisionType: CollisionType = "opaque";

  color: string;

  constructor(
    pos: Vec2,
    dim: Vec2,
    color: string,
    readonly orientation: Direction,
    readonly parentBounds: Bounds,
    readonly nextChamber: ChamberKey
  ) {
    this.pos = pos;
    this.dim = dim;

    this.color = color;
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderBox({
      ctx,
      pos: this.pos,
      dim: this.dim,
      color: this.color,
    });
  }
}

export const getMarkerPosition = (orientation: Direction, dim: Vec2): Vec2 => {
  switch (orientation) {
    case "t":
      return [dim[0] / 2, CONFIG.markerDim[0] / 2];
    case "l":
      return [CONFIG.markerDim[0] / 2, dim[1] / 2];
    case "d":
      return [dim[0] / 2, dim[1] - CONFIG.markerDim[0] / 2];
    case "r":
      return [dim[0] - CONFIG.markerDim[0] / 2, dim[1] / 2];
  }
};
