import { BaseEntity } from "../Engine/BaseEntity";
import {
  CollisionType,
  ICollisionComponent,
} from "../Engine/Components/CollisionComponent";

export class PlayerInteractionCollisionComponent
  implements ICollisionComponent
{
  type: CollisionType = "solid";

  onCollide(self: BaseEntity, other: BaseEntity) {}
}
