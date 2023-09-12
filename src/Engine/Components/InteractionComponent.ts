import { BaseEntity } from "../BaseEntity";
import { GameState } from "../GameState";
import { PLAYER_INTERACTION_COLLIDER_KEY } from "../Player/PlayerInteractionCollider";
import { Renderer } from "../Renderer/Renderer";
import { DialogueConfig, Interaction, Vec2, WorldState } from "../types";
import { add, convertTileVecToGlobal, getEntityPairKey } from "../utils";
import { speakWithNarrator, stopSpeach } from "../SpeechService";

export type ComponentState = "idle" | "available" | "active";

export interface IInteractionComponent<TWorldState extends WorldState> {
  readonly onEndInteraction?: (
    entity: BaseEntity,
    state: GameState<TWorldState>
  ) => void;
  state: ComponentState;

  startInteraction(entity: BaseEntity, state: GameState<TWorldState>): void;
  endInteraction(entity: BaseEntity, state: GameState<TWorldState>): void;

  setAvailability(isAvailable: boolean): void;

  render?(entity: BaseEntity, renderer: Renderer): void;
  update?(entity: BaseEntity, state: GameState<TWorldState>): void;
}

export class BaseInteractionComponent<TWorldState extends WorldState>
  implements IInteractionComponent<TWorldState>
{
  state: ComponentState = "idle";

  public lastInteractionSceneJumpIndex = 0;

  constructor(
    readonly onEndInteraction?: (
      entity: BaseEntity,
      state: GameState<TWorldState>
    ) => void
  ) {}

  startInteraction(_entity: BaseEntity, state: GameState<TWorldState>): void {
    this.state = "active";

    this.lastInteractionSceneJumpIndex = state.worldState.sceneJumps || 0;
  }

  endInteraction(entity: BaseEntity, state: GameState<TWorldState>): void {
    this.state = "idle";

    this.onEndInteraction?.(entity, state);
  }

  setAvailability(isAvailable: boolean) {
    if (isAvailable && this.state === "idle") {
      this.state = "available";
    } else if (!isAvailable && this.state === "available") {
      this.state = "idle";
    }
  }

  public renderTooltip(entity: BaseEntity, renderer: Renderer) {
    const p = entity.components.position.pos;

    renderer.drawText(
      `${entity.key} ${entity.isKilled ? "(dead)" : "(e)"}`,
      "l",
      ...add(p, convertTileVecToGlobal([0, -1] as Vec2)),
      {
        color: "#ffffff",
        backgroundColor: "#000000aa",
      }
    );
  }

  render(entity: BaseEntity, renderer: Renderer): void {
    if (this.state === "available") {
      this.renderTooltip(entity, renderer);
    }
  }

  update(entity: BaseEntity, state: GameState<TWorldState>): void {
    const kp: Set<string> = state.inputManager.keysPressed;

    const isColliding = state.collisionManager.collisions.has(
      getEntityPairKey(PLAYER_INTERACTION_COLLIDER_KEY, entity.key)
    );

    if (!isColliding && this.state === "available") {
      this.state = "idle";
    }

    if (!isColliding && this.state === "active") {
      this.endInteraction(entity, state);
    }

    if (this.state === "available" && kp.has("e") && !entity.isKilled) {
      this.startInteraction(entity, state);
    }

    if (this.state === "active" && kp.has("x")) {
      this.endInteraction(entity, state);
    }
  }
}

export interface IDIalogueInteractionComponent<TWorldState extends WorldState>
  extends IInteractionComponent<TWorldState> {
  readonly dialogueConfig: DialogueConfig;
  readonly interactions: Interaction[];
}

export class DialogueInteractionComponent<
  TWorldState extends WorldState
> extends BaseInteractionComponent<TWorldState> {
  private _availableOptions: Interaction[] = [];
  private _availableInteractions: Interaction[] = [];
  private _performedInteractions: Set<Interaction> = new Set();

  private _prevKP: Set<string> = new Set();

  private _didChooseOption = false;

  private _didSpokeInit = false;

  constructor(
    readonly dialogueConfig: DialogueConfig,
    readonly interactions: Interaction[],
    onEndInteraction?: (
      entity: BaseEntity,
      state: GameState<TWorldState>
    ) => void
  ) {
    super(onEndInteraction);
  }

  startInteraction(entity: BaseEntity, state: GameState<TWorldState>): void {
    super.startInteraction(entity, state);

    if (!this._didSpokeInit) {
      speakWithNarrator(this.dialogueConfig.init, this.dialogueConfig.voice);

      this._didSpokeInit = true;
    }
  }

  endInteraction(entity: BaseEntity, state: GameState<TWorldState>): void {
    super.endInteraction(entity, state);

    stopSpeach();
  }

  render(entity: BaseEntity, renderer: Renderer): void {
    super.render(entity, renderer);

    // TODO: decide if want to display dialogue after death
    if (entity.isKilled) return;

    if (entity.components.interaction!.state === "active") {
      const npcLabel = `${entity.key}:\n`;
      const youLabel = `You:\n`;

      const lines: string[] = [`${npcLabel}${this.dialogueConfig.init}\n`];

      for (const performedInteraction of this._performedInteractions) {
        lines.push(`${youLabel}${performedInteraction.text}\n`);
        lines.push(`${npcLabel}${performedInteraction.response}\n`);
      }

      let options: Interaction[] = [];

      if (this._didChooseOption) {
        options = this._availableInteractions;
      } else {
        options = [...this._availableOptions, ...this._availableInteractions];
      }

      renderer.dialogueModal(lines, options);
    }
  }

  update(entity: BaseEntity, state: GameState<TWorldState>) {
    super.update(entity, state);

    if (entity.isKilled) return;

    this._availableOptions = this.dialogueConfig.options.filter((option) =>
      option.isAvailable ? option.isAvailable(state.worldState) : true
    );

    this._availableInteractions = this.interactions.filter((interaction) =>
      interaction.isAvailable ? interaction.isAvailable(state.worldState) : true
    );

    const ic: IInteractionComponent<TWorldState> =
      entity.components.interaction!;

    const kp: Set<string> = state.inputManager.keysPressed;

    for (const dialogueOption of this._availableOptions) {
      if (ic.state !== "active") return;

      if (this._prevKP.has(dialogueOption.key)) continue;

      if (kp.has(dialogueOption.key) && !this._didChooseOption) {
        dialogueOption.action?.(state.worldState);

        this.speakInteraction(dialogueOption);

        this._performedInteractions.add(dialogueOption);
        this._didChooseOption = true;
      }
    }

    for (const interaction of this._availableInteractions) {
      if (ic.state !== "active") return;

      if (this._prevKP.has(interaction.key)) continue;

      if (kp.has(interaction.key)) {
        interaction.action?.(state.worldState);

        this.speakInteraction(interaction);

        this._performedInteractions.add(interaction);

        break;
      }
    }

    this._prevKP = new Set(kp);
  }

  speakInteraction(interaction: Interaction) {
    stopSpeach();

    speakWithNarrator(interaction.text, "player");

    if (typeof interaction.response === "string") {
      speakWithNarrator(interaction.response, this.dialogueConfig.voice);
    }
  }
}
