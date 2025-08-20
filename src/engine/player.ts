import { BaseEntity } from "./base-entity";
import { InputManager } from "./input-manager";
import { Vec2 } from "./types";

export class Player extends BaseEntity {
  private readonly velocity = 1;

  update(inputManager: InputManager): void {
    const d: Vec2 = [0, 0];
    const position = this.positionComponent;

    if (inputManager.keysPressed.has("a")) {
      d[0] -= 1;
      position.dir = "l";
    }

    if (inputManager.keysPressed.has("d")) {
      d[0] += 1;
      position.dir = "r";
    }

    if (inputManager.keysPressed.has("w")) {
      d[1] -= 1;
    }

    if (inputManager.keysPressed.has("s")) {
      d[1] += 1;
    }
    
    position.pos[0] = position.pos[0] + Math.floor(d[0] * this.velocity);
    position.pos[1] = position.pos[1] + Math.floor(d[1] * this.velocity);
  }
}
