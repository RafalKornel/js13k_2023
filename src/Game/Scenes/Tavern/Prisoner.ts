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
          "Hey!! It's you!\nThanks for leting me out...\nBut why did you have to wake me up...\nNevermind... You know what, take this key.\nIt opens the door to the inkeeper's stash.\nBut remember! Shhhh!\n<Falls asleep again>",
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
