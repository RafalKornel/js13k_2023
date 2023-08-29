import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { CELL_KEY, KNIFE } from "../../items";
import { createGameInteraction, withTimeout } from "../../helpers";
import { GameState } from "../../../Engine/GameState";
import { GameWorldState } from "../../WorldState";

const GUARD_KEY = "Guard";

const GUARD_POS: Vec2 = [7, 5];

class Guard extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.killedEntities.has(this.key)) {
      this.isKilled = true;
    }
  }
}

export const createGuard = () =>
  new Guard(
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
      createGameInteraction(
        "q",
        "<Kill the guard>",
        "Arrgghh... <You take the cell key>",
        (ws) => {
          withTimeout(() => {
            ws.killedEntities.add(GUARD_KEY);
            ws.items.add(CELL_KEY.key);
          });
        },
        (ws) => ws.items.has(KNIFE.key) && !ws.killedEntities.has(GUARD_KEY)
      ),
    ]
  );
