import { DialogueInteractionComponent } from "../../../Engine/Components/InteractionComponent";
import { GameState } from "../../../Engine/GameState";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { GameWorldState } from "../../WorldState";
import { createGameInteraction, createWinCallback } from "../../helpers";
import { ELIXIR } from "../../items";

const LAUNDRESS_KEY = "Laundress";

const GRATITUDE_DIALOGUE =
  "Thank you.\nYou are very kind man...\nYou can use my staircase if you\nwant to get out of here...";

const SCENE_JUMPS_UNTIL_DEATH = 20;

class Laundress extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    const dic = this.components
      .interaction as DialogueInteractionComponent<GameWorldState>;

    if (
      state.worldState.firstInteractionWithLaundress !==
      dic.lastInteractionSceneJumpIndex
    ) {
      state.worldState.firstInteractionWithLaundress =
        dic.lastInteractionSceneJumpIndex;
    }

    if (
      state.worldState.firstInteractionWithLaundress !== 0 &&
      state.worldState.sceneJumps -
        state.worldState.firstInteractionWithLaundress >=
        SCENE_JUMPS_UNTIL_DEATH
    ) {
      this.isKilled = true;
    }
  }
}

export const createLaundress = (pos: Vec2) =>
  new Laundress(
    pos,
    LAUNDRESS_KEY,
    IMAGES_KEY.hero,
    {
      init: "Ohh... <Coughs> I don't feel well...\nCould you help me?\nPlease hurry... <Coughs>\nI don't have much time left",
      options: [
        createGameInteraction(
          "1",
          "I've brought you medicine",
          "<Drinks elixir>" + GRATITUDE_DIALOGUE,
          createWinCallback(4),
          (ws) => ws.items.has(ELIXIR.key)
        ),
        createGameInteraction(
          "2",
          "The doctor will examine you.",
          GRATITUDE_DIALOGUE,
          createWinCallback(4),
          (ws) => ws.didHelpDoctor
        ),
      ],
    },
    []
  );
