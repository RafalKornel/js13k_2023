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

export const PRISONER_KEY = "Prisoner";

export const createPrisoner = () => {
  const prisoner = new NPC(
    PRISONER_JAIL_POS,
    PRISONER_KEY,
    IMAGES_KEY.hero,
    {
      init: "<Looks at you distrustfully>",
      options: [
        createGameInteraction(
          "1",
          "Hey! What are you here for?",
          "I'm here for killing\nannoying people like you!\n<Stabs you in the chest>",
          createKillPlayerCallback(3)
        ),
        createGameInteraction(
          "2",
          "This guard... I would slash his throat...",
          "Heyy buddy, I like your attitude!\nTake this knife and make a good use\nof it. But don't forget to come\nfor me too!",
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
        "Thanks buddy...\nNow I don't want to kill you hehe...",
        (ws) => {
          withTimeout(() => {
            ws.isPrisonerFreed = true;
          });
        },
        (ws) => ws.isPrisonerDoorOpen
      ),
    ]
  );

  return prisoner;
};
