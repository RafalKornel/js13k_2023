import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction, createWinCallback } from "../../helpers";
import { BEER, buyItem } from "../../items";

const INNKEEPER_KEY = "Innkeeper";

class Innkeeper extends NPC {}

export const createInnkeeper = (pos: Vec2) => {
  const innkeeper = new Innkeeper(
    pos,
    INNKEEPER_KEY,
    IMAGES_KEY.hero,
    {
      init: "Welcome in my tavern!\nPlease make yourself comfortable\nand don't mind this ugly drunkard...\nHe sits here every day and I can't get\nrid of him...",
      options: [
        createGameInteraction(
          "q",
          "Drunkard went home.",
          "Thank you! As you can see\nthere aren't many customers anyway...\nIf you want, you can use my staircase.",
          createWinCallback(4),
          (ws) => ws.didHelpDrunkard
        ),
      ],
    },
    [createGameInteraction("1", ...buyItem(BEER))]
  );

  innkeeper.components.position.dir = "l";

  return innkeeper;
};