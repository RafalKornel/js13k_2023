import { BaseEntity } from "./Engine/BaseEntity";
import { Direction, Vec2 } from "./Engine/types";
import { convertTileToGlobal } from "./Engine/utils";

export class Portal extends BaseEntity {
  constructor(pos: Vec2, public dir: Direction) {
    super(
      convertTileToGlobal(pos),
      convertTileToGlobal([1, 1]),
      "#0000ff",
      "portal"
    );
  }
}
