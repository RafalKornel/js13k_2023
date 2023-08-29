import { Portal } from "./Portal.ts";
import { BaseEntity, EntityKey } from "../BaseEntity.ts";
import { PositionComponent } from "../Components/PositionComponent.ts";
import { IRenderComponent } from "../Components/RenderComponent.ts";
import { Renderer } from "../Renderer.ts";
import { Direction, Vec2 } from "../types.ts";
import { add, convertTileToGlobal, mult, subtract } from "../utils.ts";
import { CONFIG } from "../config.ts";

export type SceneKey = string;

export type ConnectedScenes = Partial<Record<Direction, SceneKey>>;

export class Scene extends BaseEntity {
  portals: Partial<Record<Direction, Portal>>;

  constructor(
    public readonly sceneKey: SceneKey,
    public readonly positionComponent: PositionComponent,
    public readonly renderComponent: IRenderComponent,
    public readonly connectedScenes: ConnectedScenes = {}
  ) {
    super({ position: positionComponent, render: renderComponent }, sceneKey);

    this.portals = {};

    this.setupPortals(connectedScenes);
  }

  addChild(child: BaseEntity) {
    this.children.set(child.key, child);
  }

  hasChild(childKey: EntityKey) {
    return this.children.has(childKey);
  }

  removeChild(key: EntityKey) {
    this.children.delete(key);
  }

  render(renderer: Renderer) {
    this.components.render?.render(this.components.position, renderer);

    renderer.drawText(this.key, "l", convertTileToGlobal(CONFIG.width / 2), 2);

    Object.values(this.portals).forEach((portal) => portal.render(renderer));

    this.children.forEach((child) => {
      child.render?.(renderer);
    });
  }

  private setupPortals(connectedScenes: ConnectedScenes) {
    const portalOffset = mult([1, 1], 0.5);

    const { tilePos, tileDim } = this.components.position;

    const [w, h] = tileDim;

    const registerPortal = (pos: Vec2, dir: Direction) => {
      const p = new Portal(add(tilePos, subtract(pos, portalOffset)), dir);

      this.portals[dir] = p;

      this.registerPortal(p, connectedScenes[dir]!);
    };

    if (connectedScenes.l) {
      registerPortal([1, Math.floor(h / 2) + 1], "l");
    }

    if (connectedScenes.r) {
      registerPortal([w, Math.floor(h / 2) + 1], "r");
    }

    if (connectedScenes.t) {
      registerPortal([1 + Math.floor(w / 2), 1], "t");
    }

    if (connectedScenes.d) {
      registerPortal([1 + Math.floor(w / 2), h], "d");
    }
  }

  // Should this be here?
  static portalSceneMap = new Map<EntityKey, SceneKey>();

  registerPortal(portal: Portal, sceneKey: SceneKey) {
    this.children.set(portal.key, portal);

    Scene.portalSceneMap.set(portal.key, sceneKey);
  }
}
