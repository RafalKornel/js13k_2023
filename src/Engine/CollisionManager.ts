import { BaseEntity } from "./BaseEntity.ts";
import { WallCollisionEvent, observer } from "./Observer.ts";
import { Direction } from "./types.ts";
import { Scene } from "./Scene.ts";
import { convertTileToGlobal, mult, subtract } from "./utils.ts";
import { Player } from "../Player.ts";

export class CollisionManager {
  handleWallsCollision(player: Player, scene: Scene) {
    // TODO: optimize for rectangles?
    const halfW = player.dim[0] / 2;
    const halfH = player.dim[1] / 2;

    let direction: Direction | undefined = undefined;

    const [x, y] = convertTileToGlobal(scene.offset);
    const [w, h] = convertTileToGlobal(scene.dim);

    if (player.pos[0] - halfW <= x) {
      direction = "l";

      player.pos[0] = x + halfW;
    }

    if (player.pos[0] + halfW > x + w) {
      direction = "r";

      player.pos[0] = x + w - halfW;
    }

    if (player.pos[1] - halfH <= y) {
      direction = "t";

      player.pos[1] = y + halfH;
    }

    if (player.pos[1] + halfH > y + h) {
      direction = "d";

      player.pos[1] = y + h - halfH;
    }

    if (direction) {
      const event = {
        name: "wall-collision",
        data: {
          direction: direction,
        },
      } as WallCollisionEvent;

      observer.emitEvent(event);
    }
  }

  handleCollisions(entities: BaseEntity[]) {
    const allEntities = [...entities];

    const traverse = (entity: BaseEntity) => {
      entity.children.forEach((child) => {
        allEntities.push(child);
        traverse(child);
      });
    };

    for (const entity of entities) {
      traverse(entity);
    }

    for (let i = 0; i < allEntities.length; i++) {
      for (let j = 0; j < allEntities.length; j++) {
        if (i === j) continue;

        const entityA = allEntities[i];
        const entityB = allEntities[j];

        if (entityA.collision === "none" || entityB.collision === "none") {
          continue;
        }

        const p1 = subtract(entityA.pos, mult(entityA.dim, 0.5));
        const p2 = subtract(entityB.pos, mult(entityB.dim, 0.5));

        const areColliding =
          p1[0] < p2[0] + entityB.dim[0] &&
          p1[0] + entityA.dim[0] > p2[0] &&
          p1[1] < p2[1] + entityB.dim[1] &&
          p1[1] + entityA.dim[1] > p2[1];

        if (!areColliding) continue;

        entityA.onCollide?.(entityB);
      }
    }
  }
}
