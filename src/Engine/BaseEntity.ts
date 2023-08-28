import { ICollisionComponent } from "./Components/CollisionComponent";
import { IInteractionComponent } from "./Components/InteractionComponent";
import { IPositionComponent } from "./Components/PositionComponent";
import { IRenderComponent } from "./Components/RenderComponent";
import { Renderer } from "./Renderer";
import { GameState } from "./GameState";
import { getKey } from "./utils";

type Components = {
  position: IPositionComponent;
  render?: IRenderComponent;
  collision?: ICollisionComponent;
  interaction?: IInteractionComponent<any>;
};

export type EntityKey = string;

export class BaseEntity {
  public _isKilled: boolean;

  readonly children: Map<EntityKey, BaseEntity>;

  constructor(public components: Components, public key: EntityKey = getKey()) {
    this.children = new Map();

    this._isKilled = false;
  }

  kill() {
    this._isKilled = true;
    this.components.position.dir = "t";
  }

  get isKilled() {
    return this._isKilled;
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

    this.components.render?.render(this.components.position, renderer);
  }

  update(state: GameState) {
    this.children.forEach((child) => {
      child.update(state);
    });
  }
}
