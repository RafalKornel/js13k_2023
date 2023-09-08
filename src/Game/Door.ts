import { BaseEntity, EntityKey } from "../Engine/BaseEntity";
import { BaseInteractionComponent } from "../Engine/Components/InteractionComponent";
import { ImageRenderComponent } from "../Engine/Components/RenderComponent";
import { GameState } from "../Engine/GameState";
import { Renderer } from "../Engine/Renderer/Renderer";
import { Vec2 } from "../Engine/types";
import { IMAGES_KEY, ImageId } from "../assets";
import { GameWorldState } from "./WorldState";
import { createOffsetPositionComponent } from "./helpers";

type HasKeyCallback = (ws: GameWorldState) => boolean;

class DoorInteractionComponent extends BaseInteractionComponent<GameWorldState> {
  private _isOpen: boolean = false;
  private _hasKey: boolean = false;

  constructor(readonly hasKeyCallback: HasKeyCallback) {
    super();
  }

  update(entity: BaseEntity, state: GameState<GameWorldState>): void {
    super.update(entity, state);

    this._hasKey = this.hasKeyCallback(state.worldState);

    if (this.state === "active" && this._hasKey) {
      this._isOpen = true;
    }
  }

  render(entity: BaseEntity, renderer: Renderer): void {
    if (this._hasKey) {
      super.render(entity, renderer);
    }
  }

  get isOpen() {
    return this._isOpen;
  }
}

export class Door extends BaseEntity {
  constructor(
    key: EntityKey,
    pos: Vec2,
    imageId: ImageId,
    hasKeyCallback: HasKeyCallback,
    readonly onOpen: (ws: GameWorldState) => void,
    dir?: "l" | "r"
  ) {
    super(
      {
        position: createOffsetPositionComponent(pos, [1, 1], dir),
        collision: { type: "interactable" },
        render: new ImageRenderComponent(imageId || IMAGES_KEY.jailDoor),
        interaction: new DoorInteractionComponent(hasKeyCallback),
      },
      key
    );
  }

  update(state: GameState<GameWorldState>): void {
    const i = this.components.interaction! as DoorInteractionComponent;

    i.update!(this, state);

    if (i.isOpen) {
      this.components.collision!.type = "none";
      this.components.render = undefined;

      this.onOpen?.(state.worldState);
    }
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    this.components.interaction!.render!(this, renderer);
  }
}
