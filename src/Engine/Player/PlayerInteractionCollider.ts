import { Vec2 } from "../types.ts";
import { BaseEntity } from "../BaseEntity.ts";
import { PositionComponent } from "../Components/PositionComponent.ts";
import { PLAYER_KEY } from "./Player.ts";

export const PLAYER_INTERACTION_COLLIDER_KEY = "player_interaction_collider";

export const INTERACTION_COLLIDER_SIZE: Vec2 = [2.5, 2.5];

export class PlayerInteractionCollider extends BaseEntity {
  public interactableEntityInRange: BaseEntity | null = null;

  constructor(pos: Vec2, dim: Vec2) {
    super(
      {
        position: new PositionComponent(pos, dim),
        collision: {
          type: "solid",
          onCollide: (_self, other) => this.onCollide(other),
        },
      },
      PLAYER_INTERACTION_COLLIDER_KEY
    );
  }

  onCollide(other: BaseEntity) {
    if (other.key === PLAYER_KEY) return;

    if (other.components.collision?.type === "interactable") {
      this.interactableEntityInRange = other;

      this.interactableEntityInRange.components.interaction!.setAvailability(
        true
      );
    }
  }

  update() {
    this.interactableEntityInRange?.components.interaction!.setAvailability(
      false
    );

    this.interactableEntityInRange = null;
  }
}
