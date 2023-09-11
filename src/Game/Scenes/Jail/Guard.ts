import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { CELL_KEY, KNIFE } from "../../items";
import {
  createFailedPickpocketInteraction,
  createGameInteraction,
  createKillPlayerCallback,
  createSuccessfullPickpocketInteraction,
  withTimeout,
} from "../../helpers";
import { GameState } from "../../../Engine/GameState";
import { GameWorldState } from "../../WorldState";

const GUARD_KEY = "Guard Dan";

const GUARD_POS: Vec2 = [7, 5];

class Guard extends NPC {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.killedEntities.has(this.key)) {
      this.isKilled = true;
    }
  }
}

const createWakeUpInteraction = (type: "regular" | "escaped") =>
  createGameInteraction(
    "1",
    "Hey! Wake up!",
    type === "regular"
      ? "What? What do you want?"
      : "What are you doing outside?\n<Slashes you with sword>",
    (ws) => {
      ws.isGuardAwake = true;

      if (type === "regular") return;

      createKillPlayerCallback(3)(ws);
    },
    // (ws) =>
    (ws) =>
      !ws.isGuardAwake &&
      (type === "regular" ? !ws.isPlayerDoorOpen : ws.isPlayerDoorOpen)
  );

export const createGuard = () =>
  new Guard(
    GUARD_POS,
    GUARD_KEY,
    IMAGES_KEY.guard,
    {
      init: "Zzzzz....",
      options: [],
    },
    [
      createWakeUpInteraction("regular"),
      createWakeUpInteraction("escaped"),
      createGameInteraction(
        "q",
        "<Kill the guard>",
        "Arrgghh... <You take the cell key>",
        (ws) => {
          withTimeout(() => {
            ws.killedEntities.add(GUARD_KEY);
            ws.items.add(CELL_KEY.key);
          }, 2);
        },
        (ws) => ws.items.has(KNIFE.key) && !ws.killedEntities.has(GUARD_KEY)
      ),
      createSuccessfullPickpocketInteraction(
        GUARD_KEY,
        CELL_KEY.key,
        (ws) => !ws.isGuardAwake
      ),
      createFailedPickpocketInteraction(
        GUARD_KEY,
        "Stabs you with knife",
        (ws) => ws.isGuardAwake
      ),
    ]
  );
