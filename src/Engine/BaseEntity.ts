import { Renderer } from "./Renderer";
import { Vec2, CollisionType } from "./types";
import { getKey } from "./utils";

export type Collision = {
  type: CollisionType;
  onCollide?: (thisEntity: BaseEntity, otherEntity: BaseEntity) => void;
};

export type EntityKey = string;

export abstract class BaseEntity {
  constructor(
    public pos: Vec2,
    public dim: Vec2,
    public color: string,
    public readonly collision: Collision,
    public key: EntityKey = getKey()
  ) {}

  render(renderer: Renderer): void {
    renderer.renderRect({
      pos: this.pos,
      dim: this.dim,
      color: this.color,
    });
  }
}
