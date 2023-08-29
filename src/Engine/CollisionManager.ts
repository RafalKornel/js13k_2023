import { BaseEntity, EntityKey } from "./BaseEntity.ts";
import { Player } from "./Player/Player.ts";
import { Scene } from "./Scene/Scene.ts";
import { PairKey } from "./types.ts";
import { getEntityPairKey, mult, subtract } from "./utils.ts";

type CollisionMap = Map<PairKey<EntityKey>, { a: BaseEntity; b: BaseEntity }>;

export class CollisionManager {
  readonly collisions: CollisionMap = new Map();

  handle(player: Player, scene: Scene) {
    this.handleCollisions(player, [...scene.children.values()]);

    this.handleWallsCollision(player, scene);
  }

  private handleWallsCollision(player: Player, scene: Scene) {
    const { position } = player.components;
    // TODO: optimize for rectangles?
    const halfW = position.w / 2;
    const halfH = position.h / 2;

    const { x, y, w, h } = scene.components.position;

    if (position.x - halfW <= x) {
      position.x = x + halfW;
    }

    if (position.x + halfW > x + w) {
      position.x = x + w - halfW;
    }

    if (position.y - halfH <= y) {
      position.y = y + halfH;
    }

    if (position.y + halfH > y + h) {
      position.y = y + h - halfH;
    }
  }

  private handleCollisions(player: Player, entities: BaseEntity[]) {
    this.collisions.clear();

    const playerEntities = [player, player.interactionCollider];

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

    for (let i = 0; i < playerEntities.length; i++) {
      for (let j = 0; j < allEntities.length; j++) {
        const entityA = playerEntities[i];
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
        entityB.components.collision!.onCollide?.(entityB, entityA);

        this.collisions.set(getEntityPairKey(entityA.key, entityB.key), {
          a: entityA,
          b: entityB,
        });
      }
    }
  }
}
