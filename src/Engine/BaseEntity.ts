import { Renderer } from "./Renderer";
import { Vec2, CollisionType } from "./types";
import { getKey } from "./utils";

export type EntityKey = string;

export class BaseEntity {
  readonly children: Map<EntityKey, BaseEntity>;

  constructor(
    public pos: Vec2,
    public dim: Vec2,
    public color: string,
    public readonly collision: CollisionType,
    public key: EntityKey = getKey()
  ) {
    this.children = new Map();
  }

  addChild(child: BaseEntity) {
    this.children.set(child.key, child);
  }

  removeChild(childKey: EntityKey) {
    this.children.delete(childKey);
  }

  render(renderer: Renderer): void {
    this.children.forEach((child) => {
      child.render(renderer);
    });

    renderer.renderRect({
      pos: this.pos,
      dim: this.dim,
      color: this.color,
    });
  }

  onCollide(_other: BaseEntity) {}
}
