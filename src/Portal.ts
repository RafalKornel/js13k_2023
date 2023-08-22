import { BaseEntity } from "./Engine/BaseEntity";
import { observer } from "./Engine/Observer";
import { Direction, Vec2 } from "./Engine/types";
import { convertTileToGlobal } from "./Engine/utils";

function onCollide(thisEntity: BaseEntity, _otherEntity: BaseEntity) {
  observer.emitEvent({
    name: "portal-collision",
    data: { portal: thisEntity as Portal },
  });
}

export class Portal extends BaseEntity {
  constructor(pos: Vec2, public dir: Direction) {
    super(convertTileToGlobal(pos), convertTileToGlobal([1, 1]), "#0000ff", {
      type: "solid",
      onCollide,
    });
  }
}
