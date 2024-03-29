import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillPlayerCallback,
  withTimeout,
} from "../../helpers";
import { KNIFE } from "../../items";

export const PRISONER_JAIL_POS: Vec2 = [9, 10];

export const PRISONER_KEY = "Diego";

export const createPrisoner = () => {
  const prisoner = new NPC(
    PRISONER_JAIL_POS,
    PRISONER_KEY,
    IMAGES_KEY.prisoner,
    {
      init: "<Looks at you distrustfully>",
      voice: "maleDeep",
      options: [
        createGameInteraction(
          "1",
          "Hey! My name is...",
          "I don't care about your name scumbag...\n<Stabs you in the chest>",
          createKillPlayerCallback()
        ),
        createGameInteraction(
          "2",
          "This guard... I would slash his throat...",
          "Hey buddy, I like your attitude!\nTake this knife and kill that guard!\nAnd then we cat get out of here, he he",
          (ws) => {
            ws.items.add(KNIFE.key);
          }
        ),
      ],
    },
    [
      createGameInteraction(
        "q",
        "Let's get out!",
        "Thanks buddy...\nNow I don't want to kill you anymore hehe...",
        (ws) => {
          withTimeout(() => {
            ws.didHelpPrisoner = true;
          });
        },
        (ws) => ws.isPrisonerDoorOpen
      ),
    ]
  );

  return prisoner;
};
