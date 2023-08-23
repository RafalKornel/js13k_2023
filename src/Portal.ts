import { BaseEntity } from "./Engine/BaseEntity";
import { PositionComponent } from "./Engine/Components/PositionComponent";
import { RectRenderComponent } from "./Engine/Components/RenderComponent";
import { Direction, Vec2 } from "./Engine/types";
import { convertTileVecToGlobal } from "./Engine/utils";

export class Portal extends BaseEntity {
  constructor(pos: Vec2, public dir: Direction) {
    super({
      position: new PositionComponent(pos, convertTileVecToGlobal([1, 1])),
      render: new RectRenderComponent("#0000ff"),
      collision: { type: "portal" },
    });
  }
}
