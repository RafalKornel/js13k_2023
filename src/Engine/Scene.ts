import { Portal } from "../Portal.ts";
import { BaseEntity, EntityKey } from "./BaseEntity.ts";
import { Renderer } from "./Renderer.ts";
import { Direction, Vec2 } from "./types.ts";
import { add, convertTileToGlobal } from "./utils.ts";

export type SceneKey = string;

export type ConnectedScenes = Partial<Record<Direction, SceneKey>>;

export class Scene {
  private _children: Map<string, BaseEntity> = new Map();
  portals: Partial<Record<Direction, Portal>>;

  constructor(
    public readonly sceneKey: SceneKey,
    public readonly dim: Vec2,
    public readonly offset: Vec2,
    public readonly bg: string,
    public readonly connectedScenes: ConnectedScenes = {}
  ) {
    this.portals = {};

    this.setupPortals(connectedScenes);
  }

  addChild(child: BaseEntity) {
    this._children.set(child.key, child);
  }

  removeChild(key: EntityKey) {
    this._children.delete(key);
  }

  get children(): BaseEntity[] {
    return [...this._children.values(), ...Object.values(this.portals)];
  }

  render(renrerer: Renderer) {
    renrerer.renderRect({
      color: this.bg,
      pos: convertTileToGlobal(this.offset),
      dim: convertTileToGlobal(this.dim),
      anchor: "topLeft",
    });

    Object.values(this.portals).forEach((portal) => portal.render(renrerer));

    this._children.forEach((child) => {
      child.render?.(renrerer);
    });
  }

  private setupPortals(connectedScenes: ConnectedScenes) {
    if (connectedScenes.l) {
      const p = new Portal(add(this.offset, [0.5, this.dim[1] / 2]), "l");

      this.portals.l = p;

      Scene.registerPortal(p.key, connectedScenes.l);
    }

    if (connectedScenes.r) {
      const p = new Portal(
        add(this.offset, [this.dim[0] - 0.5, this.dim[1] / 2]),
        "r"
      );

      this.portals.r = p;

      Scene.registerPortal(p.key, connectedScenes.r);
    }

    if (connectedScenes.t) {
      const p = new Portal(add(this.offset, [this.dim[0] / 2, 0.5]), "t");

      this.portals.t = p;
      Scene.registerPortal(p.key, connectedScenes.t);
    }

    if (connectedScenes.d) {
      const p = new Portal(
        add(this.offset, [this.dim[0] / 2, this.dim[1] - 0.5]),
        "d"
      );

      this.portals.d = p;
      Scene.registerPortal(p.key, connectedScenes.d);
    }
  }

  // Should this be here?
  static portalSceneMap = new Map<EntityKey, SceneKey>();

  static registerPortal(portalKey: EntityKey, sceneKey: SceneKey) {
    Scene.portalSceneMap.set(portalKey, sceneKey);
  }
}
