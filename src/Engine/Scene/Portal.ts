import { BaseEntity } from "../BaseEntity";
import { PositionComponent } from "../Components/PositionComponent";
import { Direction, Vec2 } from "../types";

export class Portal extends BaseEntity {
  constructor(pos: Vec2, public dir: Direction) {
    super({
      position: new PositionComponent(pos, [1, 1]),
      collision: { type: "portal" },
    });
  }
}
