import { GameState } from "../../../Engine/GameState";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { GameWorldState } from "../../WorldState";
import { createGameInteraction, createWinCallback } from "../../helpers";
import { ELIXIR } from "../../items";

export const LAUNDRESS_KEY = "Laundress Eva";

const GRATITUDE_DIALOGUE =
  "Thank you.\nYou are very kind man...\nTake this key, I won't be leaving\nour city in the near future...";

const DEATH_THRESHOLD = 20;

class Laundress extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    this.handleTimedDeath(state.worldState, DEATH_THRESHOLD);
  }
}

export const createLaundress = (pos: Vec2) =>
  new Laundress(
    pos,
    LAUNDRESS_KEY,
    IMAGES_KEY.laundress,
    {
      init: "Ohh... <Coughs> I don't feel well...\nCould you help me?\nPlease hurry... <Coughs>\nI don't have much time left",
      options: [
        createGameInteraction(
          "1",
          "I've brought you medicine",
          "<Drinks elixir>" + GRATITUDE_DIALOGUE,
          createWinCallback(),
          (ws) => ws.items.has(ELIXIR.key)
        ),
        createGameInteraction(
          "2",
          "How are you feeling?",
          `I feel better now.\nThe doctor took care of me.\n${GRATITUDE_DIALOGUE}`,
          createWinCallback(),
          (ws) => ws.willDoctorExamineLaundress
        ),
      ],
    },
    []
  );
