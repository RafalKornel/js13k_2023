import { BaseEntity } from "./BaseEntity.ts";
import { WallCollisionEvent, observer } from "./Observer.ts";
import { Direction } from "./types.ts";
import { Scene } from "./Scene.ts";
import { mult, subtract } from "./utils.ts";
import { Player } from "../Player/Player.ts";

export class CollisionManager {
  handle(player: Player, scene: Scene) {
    this.handleCollisions([player, ...scene.children.values()]);

    this.handleWallsCollision(player, scene);
  }

  private handleWallsCollision(player: Player, scene: Scene) {
    const { position } = player.components;
    // TODO: optimize for rectangles?
    const halfW = position.w / 2;
    const halfH = position.h / 2;

    let direction: Direction | undefined = undefined;

    const { x, y, w, h } = scene.components.position;

    if (position.x - halfW <= x) {
      direction = "l";

      position.x = x + halfW;
    }

    if (position.x + halfW > x + w) {
      direction = "r";

      position.x = x + w - halfW;
    }

    if (position.y - halfH <= y) {
      direction = "t";

      position.y = y + halfH;
    }

    if (position.y + halfH > y + h) {
      direction = "d";

      position.y = y + h - halfH;
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

  private handleCollisions(entities: BaseEntity[]) {
    const allEntities = [...entities];

    const traverse = (entity: BaseEntity) => {
      for (const [_, child] of entity.children) {
        if (!child.components.collision) continue;

        allEntities.push(child);
        traverse(child);
      }
    };

    for (const entity of entities) {
      if (entity.components.collision) traverse(entity);
    }

    for (let i = 0; i < allEntities.length; i++) {
      for (let j = 0; j < allEntities.length; j++) {
        if (i === j) continue;

        const entityA = allEntities[i];
        const entityB = allEntities[j];

        if (
          entityA.components.collision!.type === "none" ||
          entityB.components.collision!.type === "none"
        ) {
          continue;
        }

        const p1 = subtract(
          entityA.components.position.pos,
          mult(entityA.components.position.dim, 0.5)
        );
        const p2 = subtract(
          entityB.components.position.pos,
          mult(entityB.components.position.dim, 0.5)
        );

        const areColliding =
          p1[0] < p2[0] + entityB.components.position.dim[0] &&
          p1[0] + entityA.components.position.dim[0] > p2[0] &&
          p1[1] < p2[1] + entityB.components.position.dim[1] &&
          p1[1] + entityA.components.position.dim[1] > p2[1];

        if (!areColliding) continue;

        entityA.components.collision!.onCollide?.(entityA, entityB);
      }
    }
  }
}
