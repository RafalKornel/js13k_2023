import { BaseEntity } from "../BaseEntity";
import { Direction } from "../types";

export type CollisionType = "solid" | "interactable" | "portal" | "none";

export interface ICollisionComponent {
  type: CollisionType;

  collisionSet?: Set<Direction>;

  onCollide?: (self: BaseEntity, other: BaseEntity) => void;
}
