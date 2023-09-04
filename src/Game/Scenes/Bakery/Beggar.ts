import { GameState } from "../../../Engine/GameState";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { GameWorldState } from "../../WorldState";
import { createGameInteraction, createWinCallback } from "../../helpers";
import { WATER_BUCKER } from "../../items";
import { BAKER_KEY } from "./Baker";

const DEATH_THRESHOLD = 20;

class Beggar extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    this.state = state.worldState.isWellPoisoned ? "active" : "inactive";

    if (this.state === "inactive") return;

    this.handleTimedDeath(state.worldState, DEATH_THRESHOLD);
  }
}

const GRATITUDE_RESPONSE =
  "Thank you so much! You are so kind!\nYou saved lives of my children!\nYou can use staircase in my basement\nto get out of this underground!";

export const createBeggar = (pos: Vec2) => {
  const b = new Beggar(
    pos,
    "Beggar",
    IMAGES_KEY.hero,
    {
      init: "Ohh.. We are so thirsty...\nBut the well got poisoned and\nwe cannot afford buying water from\nthis leech Ernest...\nMy poor children...\nThey do not deserve this...",
      options: [
        createGameInteraction(
          "1",
          "Take this bucket of water",
          GRATITUDE_RESPONSE,
          createWinCallback(5),
          (ws) => ws.items.has(WATER_BUCKER.key)
        ),
        createGameInteraction(
          "2",
          "Ernest is dead. You can use his well.",
          GRATITUDE_RESPONSE,
          createWinCallback(5),
          (ws) => ws.killedEntities.has(BAKER_KEY)
        ),
      ],
    },
    []
  );

  b.components.position.dir = "l";

  return b;
};
