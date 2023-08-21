import { InputKey } from "./InputKey.ts";
import { CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import {
  OpaqueCollisionEvent,
  SolidCollisionEvent,
  WallCollisionEvent,
  observer,
} from "./Observer.ts";
import { Renderer } from "./Renderer.ts";

export class Player extends BaseEntity {
  pos: Vec2;
  dim: Vec2;

  velocity = 1;

  collisionSet: Set<Direction> = new Set();

  constructor(pos: Vec2, dim: Vec2) {
    super(pos, dim, "#ff0000", { type: "solid" }, "player");

    this.pos = pos;
    this.dim = dim;

    observer.registerCallback("solid-collision", (e) => {
      const colisionEvent = e as SolidCollisionEvent;

      const { directions } = colisionEvent.data;

      directions.forEach((dir) => {
        this.collisionSet.add(dir);
      });
    });

    observer.registerCallback("opaque-collision", (e) => {
      const colisionEvent = e as OpaqueCollisionEvent;

      console.log(colisionEvent);
    });

    observer.registerCallback("wall-collision", (e) => {
      const colisionEvent = e as WallCollisionEvent;

      const { direction } = colisionEvent.data;

      this.collisionSet.add(direction);
    });
  }

  render(renderer: Renderer) {
    renderer.renderRect({
      pos: this.pos,
      dim: this.dim,
      color: this.color,
    });
  }

  update(keysPressed: Set<InputKey>): void {
    // GRAVITY

    // if (this.collisionSet.has("d")) {
    //   this.vel[1] = 0;
    // } else {
    //   this.vel[1] += 0.1; // gravity
    // }

    // this.pos[0] += this.vel[0];
    // this.pos[1] += this.vel[1];

    // if (keysPressed.has(" ") && this.collisionSet.has("d")) {
    //   this.vel[1] = -4;
    // }

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

    // diagonal movement
    // if (d[0] !== 0 && d[1] !== 0) {
    //   const len = Math.sqrt(2);

    //   d[0] /= len;
    //   d[1] /= len;
    // }

    this.pos[0] += Math.floor(d[0] * this.velocity);
    this.pos[1] += Math.floor(d[1] * this.velocity);

    this.collisionSet.clear();
  }
}
