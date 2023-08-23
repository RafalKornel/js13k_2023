import { BaseEntity } from "../BaseEntity";

export type CollisionType = "solid" | "interactable" | "portal" | "none";

export interface ICollisionComponent {
  type: CollisionType;

  onCollide?: (self: BaseEntity, other: BaseEntity) => void;
}
