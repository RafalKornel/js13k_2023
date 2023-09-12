import { GameState } from "../../../Engine/GameState";
import { Vec2 } from "../../../Engine/types";
import { add, convertTileVecToGlobal } from "../../../Engine/utils";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { GameWorldState } from "../../WorldState";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createPickpocketInteraction,
  createWinCallback,
  withTimeout,
} from "../../helpers";
import { BREAD, WATER_BUCKER, buyItem } from "../../items";

export const BAKER_KEY = "Baker Ernest";

class Baker extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.isWellPoisoned) {
      state.worldState.baker.add(WATER_BUCKER.key);
    }

    if (state.worldState.didMasonKillBaker) {
      this.isKilled = true;
      state.worldState.killedEntities.add(this.key);
      const p = this.components.position;
      p.pos = convertTileVecToGlobal(add([14, 2], [0.5, 0.5]));
    }
  }
}

export const createBaker = (pos: Vec2) =>
  new Baker(
    pos,
    BAKER_KEY,
    IMAGES_KEY.baker,
    {
      init: "Do you want to buy a bread?\nOr maybe some water from my well?\nNobody wants to buy water from me...\nPeople just go to public well...\nWho thought that water should be free?",
      voice: "ukMale",
      options: [
        createGameInteraction(
          "1",
          "I will poison the well for you.",
          "What? Really?\nThen I would be rich!\nBut don't tell anybody!",
          (ws) => {
            ws.isPlayerHelpingBaker = true;
          },
          (ws) => !ws.isWellPoisoned
        ),
        createGameInteraction(
          "2",
          "Water is a human right!",
          "Human right? Get off of here you peasant!",
          (ws) => {
            ws.isPlayerHelpingBaker = false;
          },
          (ws) => !ws.isWellPoisoned
        ),
      ],
    },
    [
      createGameInteraction("3", ...buyItem(BREAD, (ws) => ws.baker)),
      createGameInteraction("4", ...buyItem(WATER_BUCKER, (ws) => ws.baker)),
      createGameInteraction(
        "q",
        "I poisoned the well",
        "Really! Thank you!\nFinally I will earn some good money!\nYou look like someone who might need this.\n<Hands you the exit key and winks>",
        createWinCallback(),
        (ws) => ws.isWellPoisoned && ws.isPlayerHelpingBaker
      ),
      createKillInteraction("Arghh", (ws) => {
        withTimeout(() => {
          ws.killedEntities.add(BAKER_KEY);
        }, 2);
      }),
      createPickpocketInteraction(
        BAKER_KEY,
        "Hey! Get your hands off of me!\nGuards!!\n<You are caught and killed by the guards>",
        createKillPlayerCallback()
      ),
    ]
  );
