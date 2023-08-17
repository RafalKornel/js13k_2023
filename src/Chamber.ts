import { CONFIG } from "./config.ts";
import { Bounds, CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { renderBox } from "./renderBox.ts";
import { Marker, getMarkerPosition } from "./Marker.ts";

export const CHAMBERS = {
  initial: { height: 0.8, width: 0.8, markers: ["l", "t", "r", "d"] },
  horizontalTunnel: { height: 0.2, width: 0.8, markers: ["l", "r"] },
  verticalTunnel: { height: 0.8, width: 0.2, markers: ["t", "d"] },
};

export type ChamberKey = keyof typeof CHAMBERS;

type ChamberConfig = (typeof CHAMBERS)[ChamberKey];

export class Chamber extends BaseEntity {
  pos: Vec2;
  dim: Vec2;
  collision: CollisionType = "inside";

  children: BaseEntity[];

  private color = "#9e3333";

  constructor(chamberConfig: ChamberConfig) {
    super();

    this.dim = [
      chamberConfig.width * CONFIG.width,
      chamberConfig.height * CONFIG.height,
    ];

    this.pos = [
      (CONFIG.width - this.dim[0]) / 2,
      (CONFIG.height - this.dim[1]) / 2,
    ];

    const bounds = [...this.pos, ...this.dim] as Bounds;

    this.children = chamberConfig.markers.map(
      (markerOrientation) =>
        new Marker(
          getMarkerPosition(markerOrientation as Direction, this.dim),
          CONFIG.markerDim as Vec2,
          "#0000ff",
          markerOrientation as Direction,
          bounds,
          ["l", "r"].includes(markerOrientation)
            ? "horizontalTunnel"
            : "verticalTunnel"
        )
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderBox({
      ctx,
      pos: this.pos,
      dim: this.dim,
      color: this.color,
      anchor: "topLeft",
    });

    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
    this.children.forEach((child) => {
      child.render?.(ctx);
    });
  }
}
