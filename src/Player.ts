import { InputKey } from "./Engine/InputKey.ts";
import { Direction, Vec2 } from "./Engine/types.ts";
import { BaseEntity } from "./Engine/BaseEntity.ts";
import {
  PortalCollisionEvent,
  SolidCollisionEvent,
  WallCollisionEvent,
  observer,
} from "./Engine/Observer.ts";
import { Renderer } from "./Engine/Renderer.ts";
import { Scene } from "./Engine/Scene.ts";
import {
  OPPOSITE_DIRECTIONS,
  PORTAL_OFFSET,
  add,
  convertTileToGlobal,
} from "./Engine/utils.ts";
import { Game } from "./Game.ts";

export class Player extends BaseEntity {
  pos: Vec2;
  dim: Vec2;

  velocity = 1;

  collisionSet: Set<Direction> = new Set();

  constructor(readonly game: Game, pos: Vec2, dim: Vec2) {
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

    observer.registerCallback("portal-collision", (e) => {
      const colisionEvent = e as PortalCollisionEvent;

      const { portal } = colisionEvent.data;

      const sceneKey = Scene.portalSceneMap.get(portal.key)!;

      const newScene = game.sceneManager.scenes.get(sceneKey)!;

      const newPortal = newScene.portals[OPPOSITE_DIRECTIONS[portal.dir]]!;

      const offset = convertTileToGlobal(PORTAL_OFFSET[newPortal.dir]);

      this.pos = add(newPortal.pos, offset);

      console.log(newPortal);
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
