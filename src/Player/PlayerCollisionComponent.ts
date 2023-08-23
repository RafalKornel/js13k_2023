import { Player } from "./Player";
import { Portal } from "../Portal";
import { BaseEntity } from "../Engine/BaseEntity";
import { Scene } from "../Engine/Scene";
import { SceneManager } from "../Engine/SceneManager";
import {
  OPPOSITE_DIRECTIONS,
  convertTileVecToGlobal,
  PORTAL_OFFSET,
  add,
} from "../Engine/utils";
import {
  ICollisionComponent,
  CollisionType,
} from "../Engine/Components/CollisionComponent";

export class PlayerCollisionComponent implements ICollisionComponent {
  constructor(
    readonly type: CollisionType,
    readonly sceneManager: SceneManager
  ) {}

  onCollide?(self: BaseEntity, other: BaseEntity) {
    if (self.children.has(other.key)) return;

    if (other.collisionComponent.type === "portal") {
      this.handlePortalCollision(self as Player, other as Portal);
    } else if (other.collisionComponent.type === "solid") {
      this.handleSolidCollision(self as Player, other);
    }
  }

  private handlePortalCollision(self: Player, portal: Portal) {
    const sceneKey = Scene.portalSceneMap.get(portal.key)!;

    const newScene = this.sceneManager.scenes.get(sceneKey)!;

    const newPortal = newScene.portals[OPPOSITE_DIRECTIONS[portal.dir]]!;

    const offset = convertTileVecToGlobal(PORTAL_OFFSET[newPortal.dir]);

    const newPos = add(newPortal.positionComponent.pos, offset);

    this.sceneManager.changeScene(sceneKey);

    self.positionComponent.updatePos(newPos[0], newPos[1]);
  }

  private handleSolidCollision(self: Player, entity: BaseEntity) {
    const s = self.positionComponent;
    const e = entity.positionComponent;

    const dx = s.x - e.x;
    const dw = s.w / 2 + e.w / 2;

    if (Math.abs(Math.abs(dx) + 1 - Math.abs(dw)) < self.velocity) {
      const dir = dx > 0 ? "l" : "r";

      self.collisionSet.add(dir);

      s.x = e.x + (dir === "l" ? 1 : -1) * dw;
    }

    const dy = s.y - e.y;
    const dh = s.h / 2 + e.h / 2;

    if (Math.abs(Math.abs(dy) + 1 - Math.abs(dh)) < self.velocity) {
      const dir = dy > 0 ? "t" : "d";

      self.collisionSet.add(dir);

      s.y = e.y + (dir === "t" ? 1 : -1) * dh;
    }
  }
}
