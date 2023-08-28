import { Vec2 } from "../../Engine/types";
import { IMAGES_KEY } from "../../assets";
import { NPC } from "../NPC";
import { KNIFE } from "../items";
import { createGameInteraction, killPlayer, withTimeout } from "../helpers";

export const PRISONER_JAIL_POS: Vec2 = [3, 7];

export const PRISONER_KEY = "Prisoner";

export const createPrisoner = () => {
  const prisoner = new NPC(
    PRISONER_JAIL_POS,
    PRISONER_KEY,
    IMAGES_KEY.hero,
    {
      init: "<Looks at you distrustfully>",
      options: [
        createGameInteraction({
          key: "1",
          text: "Hey! What are you here for?",
          response:
            "I'm here for killing\nannoying people like you!\n<Stabs you in the chest>",
          action: killPlayer,
        }),
        createGameInteraction({
          key: "2",
          text: "This guard... I would slash his throat...",
          response:
            "Heyy buddy, I like your attitude!\nTake this knife and make a good use\nof it. But don't forget to come\nfor me too!",
          action: (ws) => {
            ws.items.add(KNIFE);
          },
        }),
      ],
    },
    [
      createGameInteraction({
        key: "1",
        text: "Let's get out!",
        response: "Thanks buddy...\nNow I don't want to kill you",
        action: (ws) => {
          withTimeout(() => {
            ws.isPrisonerFreed = true;
          });
        },
        isAvailable: (ws) => ws.isPrisonerDoorOpen,
      }),
    ]
  );

  return prisoner;
};
