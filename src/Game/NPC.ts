import { BaseEntity } from "../Engine/BaseEntity";
import { DialogueInteractionComponent } from "../Engine/Components/InteractionComponent";
import { ImageRenderComponent } from "../Engine/Components/RenderComponent";
import { Renderer } from "../Engine/Renderer/Renderer";
import { GameState } from "../Engine/GameState";
import { DialogueConfig, Interaction, Vec2 } from "../Engine/types";
import { ImageId } from "../assets";
import { createOffsetPositionComponent } from "./helpers";
import { GameWorldState } from "./WorldState";

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
        interaction: new DialogueInteractionComponent<GameWorldState>(
          dialogueConfig,
          interactions,
          (_, ws) => {
            if (ws.worldState.shouldBeKilled && !ws.worldState.isDead) {
              ws.worldState.isDead = true;
            }
          }
        ),
      },
      name
    );
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    this.components.interaction!.render!(this, renderer);
  }

  update(state: GameState<GameWorldState>) {
    super.update(state);

    if (state.worldState.killedEntities.has(this.key)) {
      this.isKilled = true;
    }

    this.components.interaction!.update!(this, state);
  }

  handleTimedDeath(worldState: GameWorldState, deathThreshold: number) {
    const dic = this.components
      .interaction as DialogueInteractionComponent<GameWorldState>;

    const firstInteractions = worldState.firstInteractions;

    let firstInteractionWithNPC = firstInteractions.get(this.key);

    if (
      !firstInteractionWithNPC ||
      firstInteractionWithNPC !== dic.lastInteractionSceneJumpIndex
    ) {
      firstInteractionWithNPC = dic.lastInteractionSceneJumpIndex;
      firstInteractions.set(this.key, firstInteractionWithNPC);
    }

    if (
      !!firstInteractionWithNPC &&
      worldState.sceneJumps - firstInteractionWithNPC >= deathThreshold
    ) {
      this.isKilled = true;
      worldState.killedEntities.add(this.key);
    }
  }
}
