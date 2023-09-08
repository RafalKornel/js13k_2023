import { Player } from "./Player";
import { Portal } from "../Scene/Portal";
import { BaseEntity } from "../BaseEntity";
import { Scene } from "../Scene/Scene";
import { SceneManager } from "../Scene/SceneManager";
import {
  OPPOSITE_DIRECTIONS,
  convertTileVecToGlobal,
  PORTAL_OFFSET,
  add,
} from "../utils";
import {
  ICollisionComponent,
  CollisionType,
} from "../Components/CollisionComponent";
import { Direction } from "../types";

export class PlayerCollisionComponent implements ICollisionComponent {
  collisionSet: Set<Direction> = new Set();

  constructor(
    readonly type: CollisionType,
    readonly sceneManager: SceneManager
  ) {}

  onCollide?(self: BaseEntity, other: BaseEntity) {
    if (self.children.has(other.key)) return;

    const t = other.components.collision?.type;

    if (t === "portal") {
      this.handlePortalCollision(self as Player, other as Portal);
    } else if (t === "solid" || t === "interactable") {
      this.handleSolidCollision(self as Player, other);
    }
  }

  private handlePortalCollision(self: Player, portal: Portal) {
    const sceneKey = Scene.portalSceneMap.get(portal.key)!;

    const newScene = this.sceneManager.scenes.get(sceneKey)!;

    const newPortal = newScene.portals[OPPOSITE_DIRECTIONS[portal.dir]!]!;

    const offset = convertTileVecToGlobal(PORTAL_OFFSET[newPortal.dir]!);

    const newPos = add(newPortal.components.position.pos, offset);

    this.sceneManager.changeScene(sceneKey);

    self.components.position.updatePos(newPos[0], newPos[1]);
  }

  private handleSolidCollision(self: Player, entity: BaseEntity) {
    const s = self.components.position;
    const e = entity.components.position;

    const dx = s.x - e.x;
    const dw = s.w / 2 + e.w / 2;

    if (Math.abs(Math.abs(dx) + 1 - Math.abs(dw)) < self.velocity) {
      const dir = dx > 0 ? "l" : "r";

      this.collisionSet.add(dir);

      s.x = e.x + (dir === "l" ? 1 : -1) * dw;
    }

    const dy = s.y - e.y;
    const dh = s.h / 2 + e.h / 2;

    if (Math.abs(Math.abs(dy) + 1 - Math.abs(dh)) < self.velocity) {
      const dir = dy > 0 ? "t" : "d";

      this.collisionSet.add(dir);

      s.y = e.y + (dir === "t" ? 1 : -1) * dh;
    }
  }
}
