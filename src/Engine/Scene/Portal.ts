import { BaseEntity } from "../BaseEntity";
import { PositionComponent } from "../Components/PositionComponent";
import { RectRenderComponent } from "../Components/RenderComponent";
import { Direction, Vec2 } from "../types";
import { convertTileVecToGlobal } from "../utils";

export class Portal extends BaseEntity {
  constructor(pos: Vec2, public dir: Direction) {
    super({
      position: new PositionComponent(pos, convertTileVecToGlobal([1, 1])),
      render: new RectRenderComponent("#0000ff"),
      collision: { type: "portal" },
    });
  }
}
