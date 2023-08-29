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

export class BaseEntity {
  private _isKilled: boolean = false;

  public get isKilled(): boolean {
    return this._isKilled;
  }

  public set isKilled(value: boolean) {
    this._isKilled = value;
    this.components.position.dir = "t";
  }

  readonly children: Map<EntityKey, BaseEntity>;

  constructor(public components: Components, public key: EntityKey = getKey()) {
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

    this.components.render?.render(this.components.position, renderer);
  }

  update(state: GameState) {
    this.children.forEach((child) => {
      child.update(state);
    });
  }
}
