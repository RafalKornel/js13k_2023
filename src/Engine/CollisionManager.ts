import { BaseEntity } from "./BaseEntity.ts";
import { WallCollisionEvent, observer } from "./Observer.ts";
import { Direction } from "./types.ts";
import { Scene } from "./Scene.ts";
import { mult, subtract } from "./utils.ts";
import { Player } from "../Player/Player.ts";

export class CollisionManager {
  handleWallsCollision(player: Player, scene: Scene) {
    const { positionComponent } = player;
    // TODO: optimize for rectangles?
    const halfW = positionComponent.w / 2;
    const halfH = positionComponent.h / 2;

    let direction: Direction | undefined = undefined;

    const { x, y, w, h } = scene.positionComponent;

    if (positionComponent.x - halfW <= x) {
      direction = "l";

      positionComponent.x = x + halfW;
    }

    if (positionComponent.x + halfW > x + w) {
      direction = "r";

      positionComponent.x = x + w - halfW;
    }

    if (positionComponent.y - halfH <= y) {
      direction = "t";

      positionComponent.y = y + halfH;
    }

    if (positionComponent.y + halfH > y + h) {
      direction = "d";

      positionComponent.y = y + h - halfH;
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

        if (
          entityA.collisionComponent.type === "none" ||
          entityB.collisionComponent.type === "none"
        ) {
          continue;
        }

        const p1 = subtract(
          entityA.positionComponent.pos,
          mult(entityA.positionComponent.dim, 0.5)
        );
        const p2 = subtract(
          entityB.positionComponent.pos,
          mult(entityB.positionComponent.dim, 0.5)
        );

        const areColliding =
          p1[0] < p2[0] + entityB.positionComponent.dim[0] &&
          p1[0] + entityA.positionComponent.dim[0] > p2[0] &&
          p1[1] < p2[1] + entityB.positionComponent.dim[1] &&
          p1[1] + entityA.positionComponent.dim[1] > p2[1];

        if (!areColliding) continue;

        entityA.collisionComponent.onCollide?.(entityA, entityB);
      }
    }
  }
}
