import { InputKey } from "./InputKey.ts";
import { CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { Game } from "./Game.ts";
import { renderBox } from "./renderBox.ts";
import {
  OpaqueCollisionEvent,
  SolidCollisionEvent,
  WallCollisionEvent,
  observer,
} from "./Observer.ts";
import { CONFIG } from "./config.ts";

export class Player implements BaseEntity {
  private width = CONFIG.tileSize;
  private color = "#ff0000";

  velocity = 1;
  pos: Vec2;
  vel: Vec2;
  dim: Vec2;
  collisionType: CollisionType = "solid";
  zIndex = 10;

  collisionSet: Set<Direction>;

  constructor(private readonly game: Game, initalPos: Vec2) {
    this.pos = initalPos;
    this.vel = [0, 0];
    this.dim = [this.width, this.width];

    this.collisionSet = new Set<Direction>();

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

  render(ctx: CanvasRenderingContext2D) {
    renderBox({ ctx, pos: this.pos, dim: this.dim, color: this.color });
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
