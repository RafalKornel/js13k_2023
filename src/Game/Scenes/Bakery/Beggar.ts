import { GameState } from "../../../Engine/GameState";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { GameWorldState } from "../../WorldState";
import { createGameInteraction, createWinCallback } from "../../helpers";
import { WATER_BUCKER } from "../../items";
import { BAKER_KEY } from "./Baker";

const BEGGAR_NAME = "Beggar Marry";

const DEATH_THRESHOLD = 20;

class Beggar extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    this.handleTimedDeath(state.worldState, DEATH_THRESHOLD);
  }
}

const GRATITUDE_RESPONSE =
  "Thank you so much! You are so kind!\nYou saved lives of my children!\nTake my key, I know you want\nto escape this underground maze...";

export const createBeggar = (pos: Vec2) => {
  const b = new Beggar(
    pos,
    BEGGAR_NAME,
    IMAGES_KEY.beggar,
    {
      init: "Shhh! Ernest will spot us! We are so thirsty...\nBut the well got poisoned and\nwe cannot afford buying water from\nthis leech Ernest...\nMy poor children...\nThey do not deserve this...",
      voice: "usFemale",
      options: [
        createGameInteraction(
          "1",
          "Take this bucket of water",
          GRATITUDE_RESPONSE,
          createWinCallback(),
          (ws) => ws.items.has(WATER_BUCKER.key)
        ),
        createGameInteraction(
          "2",
          "Ernest is dead. You can use his well.",
          GRATITUDE_RESPONSE,
          createWinCallback(),
          (ws) => ws.killedEntities.has(BAKER_KEY)
        ),
      ],
    },
    []
  );

  b.components.position.dir = "l";

  return b;
};
