import { CONFIG } from "./config.ts";
import { Bounds, CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { renderBox } from "./renderBox.ts";
import { Chamber, ChamberKey } from "./Chamber.ts";

export class Marker extends BaseEntity {
  pos: Vec2;
  dim: Vec2;
  collision: CollisionType = "outside";

  color: string;

  constructor(
    pos: Vec2,
    dim: Vec2,
    color: string,
    readonly orientation: Direction,
    readonly parentBounds: Bounds,
    readonly nextChamber: ChamberKey
  ) {
    super();

    this.pos = pos;
    this.dim = dim;

    this.color = color;
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderBox({
      ctx,
      pos: this.globalPos,
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
