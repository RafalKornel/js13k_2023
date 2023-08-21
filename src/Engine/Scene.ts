import { BaseEntity, EntityKey } from "./BaseEntity.ts";
import { Renderer } from "./Renderer.ts";
import { Vec2 } from "./types.ts";

export type SceneKey = string;

export class Scene {
  private _entities: Map<string, BaseEntity> = new Map();

  constructor(
    public readonly sceneKey: SceneKey,
    public readonly dim: Vec2, // percentage - from 0 to 1
    public readonly bg: string
  ) {}

  addChild(child: BaseEntity) {
    this._entities.set(child.key, child);
  }

  removeChild(key: EntityKey) {
    this._entities.delete(key);
  }

  get children(): BaseEntity[] {
    return [...this._entities.values()];
  }

  render(renrerer: Renderer) {
    renrerer.renderRect({
      color: this.bg,
      dimPecent: this.dim,
      anchor: "topLeft",
    });

    this._entities.forEach((entity) => {
      entity.render?.(renrerer);
    });
  }
}
