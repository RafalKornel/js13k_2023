import { BaseEntity } from "./base-entity";
import { InputManager } from "./input-manager";
import { Vec2 } from "./types";

export class Player extends BaseEntity {
  private readonly velocity = 1;

  update(inputManager: InputManager): void {
    const d: Vec2 = [0, 0];
    const pos = this.positionComponent;

    if (inputManager.keysPressed.has("a")) {
      d[0] -= 1;
      pos.dir = "l";
    }

    if (inputManager.keysPressed.has("d")) {
      d[0] += 1;
      pos.dir = "r";
    }

    if (inputManager.keysPressed.has("w")) {
      d[1] -= 1;
    }

    if (inputManager.keysPressed.has("s")) {
      d[1] += 1;
    }

    pos.x = pos.x + Math.floor(d[0] * this.velocity);
    pos.y = pos.y + Math.floor(d[1] * this.velocity);
  }
}
