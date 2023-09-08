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

export const BAKER_KEY = "Ernest";

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
    IMAGES_KEY.hero,
    {
      init: "Those damn people... They just won't buy anything\nfrom me... I have water for sale, but\nthey just go to public well...\nI would be rich if the well was unavailable.",
      options: [
        createGameInteraction(
          "1",
          "That's a good idea, I think I can help you!",
          "What? Really? But don't tell anybody!",
          (ws) => {
            ws.isPlayerHelpingBaker = true;
          },
          (ws) => !ws.isWellPoisoned
        ),
        createGameInteraction(
          "2",
          "But then people would have to pay for water...",
          "Yes, exactly! Thats the point...\nYou know, get out of here you peasant!",
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
        "Really! Thank you!\nFinally I will earn some good money!\nI can't offer you a lot, but\nyou can use my exit!",
        createWinCallback(3),
        (ws) => ws.isWellPoisoned && ws.isPlayerHelpingBaker
      ),
      createKillInteraction("Arghh", (ws) => {
        withTimeout(() => {
          ws.killedEntities.add(BAKER_KEY);
        }, 2);
      }),
      createPickpocketInteraction(
        BAKER_KEY,
        "Hey! Get your hands off of me!\nGuards!!",
        createKillPlayerCallback(3)
      ),
    ]
  );
