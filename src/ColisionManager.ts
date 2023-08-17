import { BaseEntity } from "./BaseEntity.ts";
import { Player } from "./Player.ts";
import { PlayerCollisionEvent, observer } from "./Observer.ts";
import { Direction } from "./types.ts";

export class ColisionManager {
  static handleCollisions(player: Player, entities: BaseEntity[]) {
    for (let i = 0; i < entities.length; i++) {
      if (!player.collision || !player.pos || !player.dim) continue;

      const entity = entities[i];

      if (!entity.collision || !entity.pos || !entity.dim) continue;

      const playerLeft = player.pos[0];
      const playerRight = player.pos[0] + player.dim[0];

      const entityLeft = entity.globalPos[0];
      const entityRight = entity.globalPos[0] + entity.dim[0];

      const playerTop = player.pos[1];
      const playerDown = player.pos[1] + player.dim[1];

      const entityTop = entity.globalPos[1];
      const entityDown = entity.globalPos[1] + entity.dim[1];

      const leftColision =
        playerLeft >= entityLeft && playerLeft <= entityRight;

      const rightColision =
        playerRight >= entityLeft && playerRight <= entityRight;

      const topColision = playerTop <= entityDown && playerTop >= entityTop;

      const downColision = playerDown >= entityTop && playerDown <= entityDown;

      const verticalColision = topColision || downColision;
      const horizontalColision = leftColision || rightColision;

      const areColliding =
        (verticalColision && leftColision) ||
        (verticalColision && rightColision) ||
        (horizontalColision && topColision) ||
        (horizontalColision && downColision);

      if (!areColliding) continue;

      const directions: Direction[] = [];

      if (topColision) directions.push("t");
      if (downColision) directions.push("d");
      if (leftColision) directions.push("l");
      if (rightColision) directions.push("r");

      const event = {
        name: "collision",
        data: {
          entity,
          directions,
        },
      } as PlayerCollisionEvent;

      observer.emitEvent(event);
    }
  }
}
