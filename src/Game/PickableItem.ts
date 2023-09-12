import { BaseEntity } from "../Engine/BaseEntity";
import { BaseInteractionComponent } from "../Engine/Components/InteractionComponent";
import { ImageRenderComponent } from "../Engine/Components/RenderComponent";
import { GameState } from "../Engine/GameState";
import { Renderer } from "../Engine/Renderer/Renderer";
import { Scene } from "../Engine/Scene/Scene";
import { BaseWorldState, Vec2 } from "../Engine/types";
import { GameWorldState } from "./WorldState";
import { createOffsetPositionComponent } from "./helpers";
import { Item } from "./items";

class PickableInteractionComponent extends BaseInteractionComponent<GameWorldState> {
  constructor(readonly item: Item, readonly onRemove: () => void) {
    super();
  }

  update(entity: BaseEntity, state: GameState<GameWorldState>): void {
    super.update(entity, state);

    if (this.state === "active") {
      state.worldState.items.add(this.item.key);

      this.onRemove();
    }
  }
}

export class PickableItem extends BaseEntity {
  constructor(scene: Scene, pos: Vec2, item: Item) {
    const key = item.key;

    super(
      {
        position: createOffsetPositionComponent(pos),
        render: new ImageRenderComponent(item.imageId),
        collision: { type: "interactable" },
        interaction: new PickableInteractionComponent(item, () =>
          scene.removeChild(key)
        ),
      },
      key
    );
  }

  update(state: GameState<BaseWorldState>): void {
    this.components.interaction!.update!(this, state);
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    this.components.interaction!.render!(this, renderer);
  }
}
