import { Vec2 } from "../Engine/types.ts";
import { BaseEntity } from "../Engine/BaseEntity.ts";
import { PLAYER_INTERACTION_COLLIDER_KEY, PLAYER_KEY } from "../constants.ts";
import { PositionComponent } from "../Engine/Components/PositionComponent.ts";

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
