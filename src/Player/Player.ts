import { InputManager } from "../Engine/InputManager.ts";
import { Vec2 } from "../Engine/types.ts";
import { BaseEntity } from "../Engine/BaseEntity.ts";
import { RectRenderComponent } from "../Engine/Components/RenderComponent.ts";

import { add, convertTileVecToGlobal } from "../Engine/utils.ts";
import { Game } from "../Game.ts";
import { PLAYER_KEY } from "../constants.ts";
import { PlayerCollisionComponent } from "./PlayerCollisionComponent.ts";
import { PositionComponent } from "../Engine/Components/PositionComponent.ts";
import { PlayerInteractionCollider } from "./PlayerInteractionCollider.ts";

export class Player extends BaseEntity {
  public interactionCollider: PlayerInteractionCollider;

  velocity = 1;

  constructor(readonly game: Game, pos: Vec2, dim: Vec2) {
    super(
      {
        position: new PositionComponent(pos, convertTileVecToGlobal(dim)),
        render: new RectRenderComponent("#ff0000"),
        collision: new PlayerCollisionComponent("solid", game.sceneManager),
      },
      PLAYER_KEY
    );

    this.interactionCollider = new PlayerInteractionCollider(
      this.components.position.pos,
      convertTileVecToGlobal(add(dim, [1, 1]))
    );

    this.addChild(this.interactionCollider);
  }

  update(inputManager: InputManager): void {
    const cs = this.components.collision!.collisionSet!;
    const kp = inputManager.keysPressed;

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

    this.children.forEach((child) => child.update(inputManager));
  }
}
