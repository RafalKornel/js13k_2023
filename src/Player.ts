import { InputKey } from "./InputKey.ts";
import { CollisionType, Direction, Vec2 } from "./types.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { Game } from "./Game.ts";
import { renderBox } from "./renderBox.ts";
import { PlayerCollisionEvent, observer } from "./Observer.ts";

export class Player extends BaseEntity {
  private velocity = 4;
  private width = 25;
  private color = "#ff0000";

  pos: Vec2;
  dim: Vec2;
  collision: CollisionType = "outside";
  zIndex = 10;

  colisionSet: Set<Direction>;

  constructor(private readonly game: Game, initalPos: Vec2) {
    super();

    this.pos = initalPos;
    this.dim = [this.width, this.width];

    this.colisionSet = new Set<Direction>();

    observer.registerCallback("collision", (e) => {
      const colisionEvent = e as PlayerCollisionEvent;

      colisionEvent.data.directions.forEach((dir) => {
        this.colisionSet.add(dir);
      });
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    renderBox({ ctx, pos: this.pos, dim: this.dim, color: this.color });
  }

  update(keysPressed: Set<InputKey>): void {
    if (keysPressed.has("a") && !this.colisionSet.has("l")) {
      this.pos[0] -= this.velocity;
    } else if (keysPressed.has("d") && !this.colisionSet.has("r")) {
      this.pos[0] += this.velocity;
    } else if (keysPressed.has("w") && !this.colisionSet.has("t")) {
      this.pos[1] -= this.velocity;
    } else if (keysPressed.has("s") && !this.colisionSet.has("d")) {
      this.pos[1] += this.velocity;
    }

    this.colisionSet.delete("d");
    this.colisionSet.delete("l");
    this.colisionSet.delete("t");
    this.colisionSet.delete("r");
  }
}
