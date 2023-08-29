import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createPickpocketInteraction,
  createWinCallback,
} from "../../helpers";
import { BREAD, buyItem } from "../../items";

const BAKER_KEY = "Ernest";

class Baker extends NPC {}

export const createBaker = () =>
  new Baker(
    [5, 5],
    BAKER_KEY,
    IMAGES_KEY.hero,
    {
      init: "Those damn people... They just won't buy anything\nfrom me... I have water for sale, but\nthey just go to public well...\nI would be rich if the well was dry...",
      options: [
        createGameInteraction(
          "q",
          "I poisoned the well",
          "Really! Thank you!\nFinally I will earn some good money!\nI can't offer you a lot, but\nyou can use my exit!",
          createWinCallback(3),
          (ws) => ws.isWellPoisoned
        ),
      ],
    },
    [
      createGameInteraction("1", ...buyItem(BREAD)),
      createKillInteraction("Arghh", (ws) => {
        ws.killedEntities.add(BAKER_KEY);
      }),
      createPickpocketInteraction(
        "Hey! Get your hands off of me!\nGuards!!",
        createKillPlayerCallback(3)
      ),
    ]
  );
