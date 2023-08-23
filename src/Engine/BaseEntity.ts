import { ICollisionComponent } from "./Components/CollisionComponent";
import { IPositionComponent } from "./Components/PositionComponent";
import { IRenderComponent } from "./Components/RenderComponent";
import { Renderer } from "./Renderer";
import { getKey } from "./utils";

export type EntityKey = string;

export class BaseEntity {
  readonly children: Map<EntityKey, BaseEntity>;

  constructor(
    public positionComponent: IPositionComponent,
    public renderComponent: IRenderComponent,
    public collisionComponent: ICollisionComponent = { type: "none" },
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

    this.renderComponent.render(this.positionComponent, renderer);
  }

  update(...args: any[]) {}
}
