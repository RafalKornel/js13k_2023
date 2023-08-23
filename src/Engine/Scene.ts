import { Portal } from "../Portal.ts";
import { BaseEntity, EntityKey } from "./BaseEntity.ts";
import { PositionComponent } from "./Components/PositionComponent.ts";
import { RectRenderComponent } from "./Components/RenderComponent.ts";
import { Renderer } from "./Renderer.ts";
import { Direction } from "./types.ts";
import { add, convertTileToGlobal } from "./utils.ts";

export type SceneKey = string;

export type ConnectedScenes = Partial<Record<Direction, SceneKey>>;

export class Scene extends BaseEntity {
  portals: Partial<Record<Direction, Portal>>;

  constructor(
    public readonly sceneKey: SceneKey,
    public readonly positionComponent: PositionComponent,
    public readonly renderComponent: RectRenderComponent,
    public readonly connectedScenes: ConnectedScenes = {}
  ) {
    super({ position: positionComponent, render: renderComponent }, sceneKey);

    this.portals = {};

    this.setupPortals(connectedScenes);
  }

  addChild(child: BaseEntity) {
    this.children.set(child.key, child);
  }

  removeChild(key: EntityKey) {
    this.children.delete(key);
  }

  render(renderer: Renderer) {
    this.components.render.render(this.components.position, renderer);

    Object.values(this.portals).forEach((portal) => portal.render(renderer));

    this.children.forEach((child) => {
      child.render?.(renderer);
    });
  }

  private setupPortals(connectedScenes: ConnectedScenes) {
    const portalOffset = convertTileToGlobal(0.5);

    const { pos, w, h } = this.components.position;
    if (connectedScenes.l) {
      const p = new Portal(add(pos, [portalOffset, h / 2]), "l");

      this.portals.l = p;

      this.registerPortal(p, connectedScenes.l);
    }

    if (connectedScenes.r) {
      const p = new Portal(add(pos, [w - portalOffset, h / 2]), "r");

      this.portals.r = p;

      this.registerPortal(p, connectedScenes.r);
    }

    if (connectedScenes.t) {
      const p = new Portal(add(pos, [w / 2, portalOffset]), "t");

      this.portals.t = p;
      this.registerPortal(p, connectedScenes.t);
    }

    if (connectedScenes.d) {
      const p = new Portal(add(pos, [w / 2, h - portalOffset]), "d");

      this.portals.d = p;
      this.registerPortal(p, connectedScenes.d);
    }
  }

  // Should this be here?
  static portalSceneMap = new Map<EntityKey, SceneKey>();

  registerPortal(portal: Portal, sceneKey: SceneKey) {
    this.children.set(portal.key, portal);

    Scene.portalSceneMap.set(portal.key, sceneKey);
  }
}
