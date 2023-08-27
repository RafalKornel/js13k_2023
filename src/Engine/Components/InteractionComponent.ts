import { BaseEntity } from "../BaseEntity";
import { GameState } from "../GameState";
import { PLAYER_INTERACTION_COLLIDER_KEY } from "../Player/PlayerInteractionCollider";
import { Renderer } from "../Renderer";
import {
  DialogueConfig,
  DialogueOption,
  Interaction,
  Vec2,
  WorldState,
} from "../types";
import { add, convertTileVecToGlobal, getEntityPairKey } from "../utils";

export type ComponentState = "idle" | "available" | "active";

export interface IInteractionComponent<TWorldState extends WorldState> {
  readonly dialogueConfig: DialogueConfig;
  readonly interactions: Interaction[];
  selectedOption?: DialogueOption;

  state: ComponentState;

  startInteraction(): void;
  endInteraction(): void;

  setAvailability(isAvailable: boolean): void;

  render?(entity: BaseEntity, renderer: Renderer): void;
  update?(entity: BaseEntity, state: GameState<TWorldState>): void;
}

export class DialogueInteractionComponent<TWorldState extends WorldState>
  implements IInteractionComponent<TWorldState>
{
  selectedOption?: DialogueOption = undefined;
  state: ComponentState = "idle";

  constructor(
    readonly dialogueConfig: DialogueConfig,
    readonly interactions: Interaction[]
  ) {}

  startInteraction(): void {
    this.state = "active";
  }

  endInteraction(): void {
    this.state = "idle";
  }

  setAvailability(isAvailable: boolean) {
    if (isAvailable && this.state === "idle") {
      this.state = "available";
    } else if (!isAvailable && this.state === "available") {
      this.state = "idle";
    }
  }

  render(entity: BaseEntity, renderer: Renderer): void {
    if (this.state === "available") {
      // TOOLTIP

      const p = entity.components.position.pos;
      renderer.drawText(
        `${entity.key} (e)`,
        "l",
        ...add(p, convertTileVecToGlobal([0, -1] as Vec2))
      );
    } else if (entity.components.interaction!.state === "active") {
      const es = `${entity.key} says:\n`;

      const leftText = this.selectedOption
        ? `${es}${this.dialogueConfig.init}\n\nYou:\n${this.selectedOption.text}\n\n${es}${this.selectedOption.response}`
        : `${es}${this.dialogueConfig.init}`;

      const options = this.selectedOption
        ? this.interactions
        : [...this.dialogueConfig.options, ...this.interactions];

      renderer.dialogueModal(leftText, options);
    }
  }

  update(entity: BaseEntity, state: GameState<TWorldState>) {
    const ic: IInteractionComponent<TWorldState> =
      entity.components.interaction!;

    const kp: Set<string> = state.inputManager.keysPressed;

    if (
      !state.collisionManager.collisions.has(
        getEntityPairKey(entity.key, PLAYER_INTERACTION_COLLIDER_KEY)
      ) &&
      ic.state === "active"
    ) {
      ic.endInteraction();
    }

    if (ic.state === "available" && kp.has("e")) {
      ic.startInteraction();
    }

    if (ic.state === "active" && kp.has("x")) {
      ic.endInteraction();
    }

    for (const dialogueOption of this.dialogueConfig.options) {
      if (kp.has(dialogueOption.key)) {
        dialogueOption.action?.(state.worldState);

        this.selectedOption = dialogueOption;
      }
    }

    for (const interaction of this.interactions) {
      if (kp.has(interaction.key)) {
        console.log(interaction);
        this.endInteraction();

        interaction.action?.(state.worldState);

        break;
      }
    }
  }
}
