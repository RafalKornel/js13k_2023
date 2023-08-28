import { Vec2 } from "../../Engine/types";
import { IMAGES_KEY } from "../../assets";
import { NPC } from "../NPC";
import { CELL_KEY, KNIFE } from "../items";
import { createGameInteraction } from "../helpers";
import { GameState } from "../../Engine/GameState";
import { GameWorldState } from "../WorldState";

const GUARD_KEY = "Guard";

const GUARD_POS: Vec2 = [9, 1];

class Guard extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.isGuardKilled) {
      this.kill();
    }
  }
}

export const createGuard = () => {
  const guard = new Guard(
    GUARD_POS,
    GUARD_KEY,
    IMAGES_KEY.hero,
    {
      init: "Zzzzz....",
      options: [
        {
          key: "1",
          response: "What? What do you want?",
          text: "Hey! Wake up!",
        },
      ],
    },
    [
      createGameInteraction({
        key: "q",
        response: "Arrgghh...",
        text: "<Kill the guard and take cell key>",
        action: (ws) => {
          ws.isGuardKilled = true;
          ws.items.add(CELL_KEY);
        },
        isAvailable: (ws) => ws.items.has(KNIFE) && !ws.isGuardKilled,
      }),
    ]
  );

  return guard;
};
