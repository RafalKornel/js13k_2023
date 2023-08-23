import { Direction, Vec2 } from "../types.ts";
import { BaseEntity } from "../BaseEntity.ts";
import { RectRenderComponent } from "../Components/RenderComponent.ts";

import { add, convertTileVecToGlobal } from "../utils.ts";
import { PlayerCollisionComponent } from "./PlayerCollisionComponent.ts";
import { PositionComponent } from "../Components/PositionComponent.ts";
import { PlayerInteractionCollider } from "./PlayerInteractionCollider.ts";
import { GameState } from "../GameState.ts";

export const PLAYER_KEY = "player";

export class Player extends BaseEntity {
  public interactionCollider: PlayerInteractionCollider;

  velocity = 1;

  constructor(readonly state: GameState, pos: Vec2, dim: Vec2) {
    super(
      {
        position: new PositionComponent(pos, convertTileVecToGlobal(dim)),
        render: new RectRenderComponent("#ff0000"),
        collision: new PlayerCollisionComponent("solid", state.sceneManager),
      },
      PLAYER_KEY
    );

    this.interactionCollider = new PlayerInteractionCollider(
      this.components.position.pos,
      convertTileVecToGlobal(add(dim, [2, 2]))
    );

    this.addChild(this.interactionCollider);
  }

  update(state: GameState): void {
    const cs: Set<Direction> = this.components.collision!.collisionSet!;
    const kp: Set<string> = state.inputManager.keysPressed;

    const d: Vec2 = [0, 0];

    if (kp.has("a") && !cs.has("l")) {
      d[0] -= 1;
    }

    if (kp.has("d") && !cs.has("r")) {
      d[0] += 1;
    }

    if (kp.has("w") && !cs.has("t")) {
      d[1] -= 1;
    }

    if (kp.has("s") && !cs.has("d")) {
      d[1] += 1;
    }

    this.components.position.x =
      this.components.position.x + Math.floor(d[0] * this.velocity);
    this.components.position.y =
      this.components.position.y + Math.floor(d[1] * this.velocity);

    cs.clear();

    this.children.forEach((child) => child.update(state));
  }
}
