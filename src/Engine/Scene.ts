import { Portal } from "../Portal.ts";
import { BaseEntity, EntityKey } from "./BaseEntity.ts";
import { PositionComponent } from "./Components/PositionComponent.ts";
import { RectRenderComponent } from "./Components/RenderComponent.ts";
import { Renderer } from "./Renderer.ts";
import { Direction } from "./types.ts";
import { add, convertTileToGlobal } from "./utils.ts";

export type SceneKey = string;

export type ConnectedScenes = Partial<Record<Direction, SceneKey>>;

export class Scene {
  private _children: Map<string, BaseEntity> = new Map();
  portals: Partial<Record<Direction, Portal>>;

  constructor(
    public readonly sceneKey: SceneKey,
    public readonly positionComponent: PositionComponent,
    public readonly renderComponent: RectRenderComponent,
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

  render(renderer: Renderer) {
    this.renderComponent.render(this.positionComponent, renderer);

    Object.values(this.portals).forEach((portal) => portal.render(renderer));

    this._children.forEach((child) => {
      child.render?.(renderer);
    });
  }

  private setupPortals(connectedScenes: ConnectedScenes) {
    const portalOffset = convertTileToGlobal(0.5);

    const { pos, w, h } = this.positionComponent;
    if (connectedScenes.l) {
      const p = new Portal(add(pos, [portalOffset, h / 2]), "l");

      this.portals.l = p;

      Scene.registerPortal(p.key, connectedScenes.l);
    }

    if (connectedScenes.r) {
      const p = new Portal(add(pos, [w - portalOffset, h / 2]), "r");

      this.portals.r = p;

      Scene.registerPortal(p.key, connectedScenes.r);
    }

    if (connectedScenes.t) {
      const p = new Portal(add(pos, [w / 2, portalOffset]), "t");

      this.portals.t = p;
      Scene.registerPortal(p.key, connectedScenes.t);
    }

    if (connectedScenes.d) {
      const p = new Portal(add(pos, [w / 2, h - portalOffset]), "d");

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
