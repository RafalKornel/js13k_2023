import { BaseEntity } from "../Engine/BaseEntity";
import { DialogueInteractionComponent } from "../Engine/Components/InteractionComponent";
import { ImageRenderComponent } from "../Engine/Components/RenderComponent";
import { Renderer } from "../Engine/Renderer/Renderer";
import { GameState } from "../Engine/GameState";
import { DialogueConfig, Interaction, Vec2 } from "../Engine/types";
import { ImageId } from "../assets";
import { createOffsetPositionComponent } from "./helpers";

export class NPC extends BaseEntity {
  constructor(
    pos: Vec2,
    name: string,
    imageId: ImageId,
    dialogueConfig: DialogueConfig,
    interactions: Interaction[]
  ) {
    super(
      {
        position: createOffsetPositionComponent(pos),
        render: new ImageRenderComponent(imageId),
        collision: { type: "interactable" },
        interaction: new DialogueInteractionComponent(
          dialogueConfig,
          interactions
        ),
      },
      name
    );
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    this.components.interaction!.render!(this, renderer);
  }

  update(state: GameState) {
    this.components.interaction!.update!(this, state);
  }
}
