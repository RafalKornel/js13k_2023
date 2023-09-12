import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createSuccessfullPickpocketInteraction,
} from "../../helpers";
import { BEER, STASH_KEY } from "../../items";

export const PRISONER_KEY = "Diego";

export const createPrisoner = (pos: Vec2) => {
  const prisoner = new NPC(
    pos,
    PRISONER_KEY,
    IMAGES_KEY.prisoner,
    {
      init: "Zzzz...\n<The prisoner is sleeping, completely drunk>",
      voice: "maleDeep",
      options: [
        createGameInteraction(
          "1",
          "Wake up!",
          "Heyy!! It's you! Hic!\nThanks ffor leetting me out...\nBut why did you have to wwake me up...\nNnnevermind... You know what, take thish key.\nIt opens doors to the inkeeper's stash.\nBbbut remember! Shhhh!\n<Falls asleep again>",
          (ws) => {
            ws.items.add(STASH_KEY.key);
          }
        ),
      ],
    },
    [createSuccessfullPickpocketInteraction(PRISONER_KEY, BEER.key)]
  );

  return prisoner;
};
