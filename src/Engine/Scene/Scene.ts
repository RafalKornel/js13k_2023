import { Portal } from "./Portal.ts";
import { BaseEntity, EntityKey } from "../BaseEntity.ts";
import { PositionComponent } from "../Components/PositionComponent.ts";
import { IRenderComponent } from "../Components/RenderComponent.ts";
import { Direction, Vec2 } from "../types.ts";
import { add, convertTileToGlobal, mult, subtract } from "../utils.ts";
import { CONFIG } from "../config.ts";
import { Renderer } from "../Renderer/Renderer.ts";
import { createSolidEntity } from "../../Game/helpers.ts";
import { IMAGES_KEY } from "../../assets.ts";

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
    this.setupBricks();
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

  get dim() {
    return this.components.position.tileDim;
  }

  render(renderer: Renderer) {
    this.components.render?.render(this.components.position, renderer);

    if (!this.key.startsWith("T-")) {
      renderer.drawText(
        this.key,
        "l",
        convertTileToGlobal(CONFIG.width - 1),
        2,
        {
          anchor: "right",
        }
      );
    }

    Object.values(this.portals).forEach((portal) => portal.render(renderer));

    this.children.forEach((child) => {
      child.render?.(renderer);
    });
  }

  private setupBricks() {
    const p = this.components.position;

    const [x, y] = p.tilePos;
    const [w, h] = p.tileDim;

    let brickPositions: Vec2[] = [];

    for (let _x = x; _x < x + w; _x++) {
      brickPositions.push([_x, y]);
      brickPositions.push([_x, y + h - 1]);
    }

    for (let _y = y; _y < y + h; _y++) {
      brickPositions.push([x, _y]);
      brickPositions.push([x + w - 1, _y]);
    }

    const portalPositions = Object.values(this.portals).map((p) => {
      const pp = p.components.position;
      return subtract(pp.tilePos, mult(pp.tileDim, 0.5));
    });

    console.log(portalPositions);

    brickPositions = brickPositions.filter(
      (p) => !portalPositions.find((pp) => pp[0] === p[0] && pp[1] === p[1])
    );

    brickPositions.forEach((brickPos) => {
      this.addChild(createSolidEntity(IMAGES_KEY.wall, brickPos));
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
