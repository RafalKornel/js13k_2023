import { Direction, Vec2 } from "../types.ts";
import { BaseEntity } from "../BaseEntity.ts";

import { add, convertTileVecToGlobal } from "../utils.ts";
import { PlayerCollisionComponent } from "./PlayerCollisionComponent.ts";
import { PositionComponent } from "../Components/PositionComponent.ts";
import {
  INTERACTION_COLLIDER_SIZE,
  PlayerInteractionCollider,
} from "./PlayerInteractionCollider.ts";
import { GameState } from "../GameState.ts";
import { ImageRenderComponent } from "../Components/RenderComponent.ts";
import { IMAGES_KEY } from "../../assets.ts";

export const PLAYER_KEY = "player";

export class Player extends BaseEntity {
  public interactionCollider: PlayerInteractionCollider;

  velocity = 1;

  constructor(readonly state: GameState, pos: Vec2, dim: Vec2) {
    super(
      {
        position: new PositionComponent(
          convertTileVecToGlobal(pos),
          convertTileVecToGlobal(dim)
        ),
        render: new ImageRenderComponent(IMAGES_KEY.hero),
        collision: new PlayerCollisionComponent("solid", state.sceneManager),
      },
      PLAYER_KEY
    );

    this.interactionCollider = new PlayerInteractionCollider(
      this.components.position.pos,
      convertTileVecToGlobal(add(dim, INTERACTION_COLLIDER_SIZE))
    );

    this.addChild(this.interactionCollider);
  }

  update(state: GameState): void {
    const pos = this.components.position;

    const cs: Set<Direction> = this.components.collision!.collisionSet!;
    const kp: Set<string> = state.inputManager.keysPressed;

    const d: Vec2 = [0, 0];

    if (kp.has("a") && !cs.has("l")) {
      d[0] -= 1;
      pos.dir = "l";
    }

    if (kp.has("d") && !cs.has("r")) {
      d[0] += 1;
      pos.dir = "r";
    }

    if (kp.has("w") && !cs.has("t")) {
      d[1] -= 1;
    }

    if (kp.has("s") && !cs.has("d")) {
      d[1] += 1;
    }

    pos.x = pos.x + Math.floor(d[0] * this.velocity);
    pos.y = pos.y + Math.floor(d[1] * this.velocity);

    cs.clear();

    this.children.forEach((child) => child.update(state));
  }
}
