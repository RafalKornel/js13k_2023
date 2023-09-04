import { ICollisionComponent } from "./Components/CollisionComponent";
import { IInteractionComponent } from "./Components/InteractionComponent";
import { IPositionComponent } from "./Components/PositionComponent";
import { IRenderComponent } from "./Components/RenderComponent";
import { Renderer } from "./Renderer/Renderer";
import { GameState } from "./GameState";
import { getKey } from "./utils";

type Components = {
  position: IPositionComponent;
  render?: IRenderComponent;
  collision?: ICollisionComponent;
  interaction?: IInteractionComponent<any>;
};

export type EntityKey = string;

export type EntityState = "active" | "inactive" | "dead";

export class BaseEntity {
  public state: EntityState = "active";

  readonly children: Map<EntityKey, BaseEntity>;

  constructor(public components: Components, public key: EntityKey = getKey()) {
    this.children = new Map();
  }

  get isKilled() {
    return this.state === "dead";
  }

  set isKilled(value: boolean) {
    if (value) {
      this.state = "dead";
      this.components.position.dir = "t";
    }
  }

  addChild(child: BaseEntity) {
    this.children.set(child.key, child);
  }

  removeChild(childKey: EntityKey) {
    this.children.delete(childKey);
  }

  render(renderer: Renderer): void {
    if (this.state === "inactive") return;

    // if (this.state === "dead") this.components.position.dir = "t";

    this.children.forEach((child) => {
      child.render(renderer);
    });

    this.components.render?.render(this.components.position, renderer);
  }

  update(state: GameState) {
    if (this.state === "inactive") return;

    this.children.forEach((child) => {
      child.update(state);
    });
  }
}
