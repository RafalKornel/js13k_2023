import { InputKey } from "../Engine/InputKey.ts";
import { Direction, Vec2 } from "../Engine/types.ts";
import { BaseEntity } from "../Engine/BaseEntity.ts";
import { RectRenderComponent } from "../Engine/Components/RenderComponent.ts";

import { add, convertTileVecToGlobal } from "../Engine/utils.ts";
import { Game } from "../Game.ts";
import { PLAYER_INTERACTION_COLLIDER_KEY, PLAYER_KEY } from "../constants.ts";
import { PlayerCollisionComponent } from "./PlayerCollisionComponent.ts";
import { PositionComponent } from "../Engine/Components/PositionComponent.ts";

class PlayerInteractionCollider extends BaseEntity {
  private interactableEntityInRange: BaseEntity | null = null;

  constructor(pos: Vec2, dim: Vec2) {
    super(
      new PositionComponent(pos, dim),
      new RectRenderComponent("#00ff00"),
      { type: "solid", onCollide: (_self, other) => this.onCollide(other) },
      PLAYER_INTERACTION_COLLIDER_KEY
    );
  }

  onCollide(other: BaseEntity) {
    if (other.key === PLAYER_KEY) return;

    if (other.collisionComponent.type === "interactable") {
      this.interactableEntityInRange = other;
      console.log(this.interactableEntityInRange);
      // this.interactableEntitiesInRange.add(other);
    }
  }

  performInteraction() {
    // if (this.interactableEntitiesInRange.size === 0) return;
    // const closestEntity = [...this.interactableEntitiesInRange.values()].sort(
    //   (a, b) => len(subtract(a.pos, this.pos)) - len(subtract(b.pos, this.pos))
    // )[0];
    // closestEntity.
  }

  update() {
    if (this.interactableEntityInRange) {
      this.interactableEntityInRange;
    }

    this.interactableEntityInRange = null;
  }
}

export class Player extends BaseEntity {
  private interactionCollider: PlayerInteractionCollider;

  velocity = 1;

  collisionSet: Set<Direction> = new Set();

  constructor(readonly game: Game, pos: Vec2, dim: Vec2) {
    super(
      new PositionComponent(pos, convertTileVecToGlobal(dim)),
      new RectRenderComponent("#ff0000"),
      new PlayerCollisionComponent("solid", game.sceneManager),
      PLAYER_KEY
    );

    this.interactionCollider = new PlayerInteractionCollider(
      this.positionComponent.pos,
      convertTileVecToGlobal(add(dim, [1, 1]))
    );

    this.addChild(this.interactionCollider);
  }

  update(keysPressed: Set<InputKey>): void {
    const d: Vec2 = [0, 0];

    if (keysPressed.has("a") && !this.collisionSet.has("l")) {
      d[0] -= 1;
    }

    if (keysPressed.has("d") && !this.collisionSet.has("r")) {
      d[0] += 1;
    }

    if (keysPressed.has("w") && !this.collisionSet.has("t")) {
      d[1] -= 1;
    }

    if (keysPressed.has("s") && !this.collisionSet.has("d")) {
      d[1] += 1;
    }

    this.positionComponent.x =
      this.positionComponent.x + Math.floor(d[0] * this.velocity);
    this.positionComponent.y =
      this.positionComponent.y + Math.floor(d[1] * this.velocity);

    this.collisionSet.clear();

    this.children.forEach((child) => child.update());
  }
}
