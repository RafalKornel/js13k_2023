import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillInteraction,
  withTimeout,
} from "../../helpers";
import { MILK } from "../../items";

export const DRUNKARD_KEY = "Drunkard";

class Drunkard extends NPC {}

export const createDrunkard = (pos: Vec2) =>
  new Drunkard(
    pos,
    DRUNKARD_KEY,
    IMAGES_KEY.drunkard,
    {
      init: "<The drunkard stinks like beer and urine>\nWhat do you want?\nCrap, I was supposed to buy milk...\nBut I got drunk instead.\nI'm never coming to my wive without\nthis stupid milk!",
      voice: "maleDeep",
      options: [
        createGameInteraction(
          "q",
          "Take this milk and get back to your wife.",
          "Thank you! I'm outta here... Hic!",
          (ws) => {
            withTimeout(() => {
              ws.didHelpDrunkard = true;
              ws.items.delete(MILK.key);
            }, 3);
          },
          (ws) => ws.items.has(MILK.key)
        ),
      ],
    },
    [
      createKillInteraction("Ughhh..", (ws) => {
        ws.killedEntities.add(DRUNKARD_KEY);
      }),
    ]
  );
