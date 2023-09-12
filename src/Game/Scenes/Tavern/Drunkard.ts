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
      init: "Hic! Whaat do youu want?\nOhhh crap, I was sssupossed to buy m-milk...\nBut I got ddrunk instd. Hic!\nI'm never coming to mmmy wive without\nstupid mmilk!",
      options: [
        createGameInteraction(
          "q",
          "Take this milk and get back to your wife.",
          "Ttthank you! I'm outta here... Hic!",
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
