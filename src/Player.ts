import { InputKey } from "./Engine/InputKey.ts";
import { Direction, Vec2 } from "./Engine/types.ts";
import { BaseEntity } from "./Engine/BaseEntity.ts";

import { Scene } from "./Engine/Scene.ts";
import {
  OPPOSITE_DIRECTIONS,
  PORTAL_OFFSET,
  add,
  convertTileToGlobal,
} from "./Engine/utils.ts";
import { Game } from "./Game.ts";
import { Portal } from "./Portal.ts";
import { PLAYER_INTERACTION_COLLIDER_KEY, PLAYER_KEY } from "./constants.ts";

class PlayerInteractionCollider extends BaseEntity {
  constructor(pos: Vec2, dim: Vec2) {
    super(pos, dim, "#00ff00", "solid", PLAYER_INTERACTION_COLLIDER_KEY);
  }

  onCollide(o: BaseEntity) {
    if (o.key === PLAYER_KEY) return;

    console.log("collider collision!");
    console.log(o);
  }
}

export class Player extends BaseEntity {
  velocity = 1;

  collisionSet: Set<Direction> = new Set();

  constructor(readonly game: Game, pos: Vec2, dim: Vec2) {
    super(pos, convertTileToGlobal(dim), "#ff0000", "solid", PLAYER_KEY);

    const collider = new PlayerInteractionCollider(
      this.pos,
      convertTileToGlobal(add(dim, [1, 1]))
    );

    this.addChild(collider);
  }

  onCollide(entity: BaseEntity) {
    if (this.children.has(entity.key)) return;

    if (entity.collision === "portal") {
      this.handlePortalCollision(entity as Portal);
    } else if (entity.collision === "solid") {
      this.handleSolidCollision(entity);
    }
  }

  private handlePortalCollision(portal: Portal) {
    const sceneKey = Scene.portalSceneMap.get(portal.key)!;

    const newScene = this.game.sceneManager.scenes.get(sceneKey)!;

    const newPortal = newScene.portals[OPPOSITE_DIRECTIONS[portal.dir]]!;

    const offset = convertTileToGlobal(PORTAL_OFFSET[newPortal.dir]);

    const newPos = add(newPortal.pos, offset);

    this.game.sceneManager.changeScene(sceneKey);

    this.pos[0] = newPos[0];
    this.pos[1] = newPos[1];
  }

  private handleSolidCollision(entity: BaseEntity) {
    const dx = this.pos[0] - entity.pos[0];
    const dw = this.dim[0] / 2 + entity.dim[0] / 2;

    if (Math.abs(Math.abs(dx) + 1 - Math.abs(dw)) < this.velocity) {
      const dir = dx > 0 ? "l" : "r";

      this.collisionSet.add(dir);

      this.pos[0] = entity.pos[0] + (dir === "l" ? 1 : -1) * dw;
    }

    const dy = this.pos[1] - entity.pos[1];
    const dh = this.dim[1] / 2 + entity.dim[1] / 2;

    if (Math.abs(Math.abs(dy) + 1 - Math.abs(dh)) < this.velocity) {
      const dir = dy > 0 ? "t" : "d";

      this.collisionSet.add(dir);

      this.pos[1] = entity.pos[1] + (dir === "t" ? 1 : -1) * dh;
    }
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

    this.pos[0] += Math.floor(d[0] * this.velocity);
    this.pos[1] += Math.floor(d[1] * this.velocity);

    this.collisionSet.clear();
  }
}
