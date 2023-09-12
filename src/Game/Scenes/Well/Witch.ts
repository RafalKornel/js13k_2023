import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction, createKillPlayerCallback } from "../../helpers";
import { ELIXIR, POISON } from "../../items";

export const WITCH_KEY = "Witch Margaret";

class Witch extends NPC {}

export const createWitch = (pos: Vec2) => {
  const witch = new Witch(
    pos,
    WITCH_KEY,
    IMAGES_KEY.witch,
    {
      init: "Those people... I hate them so much...\nThey burn my sisters!\nThey would be better off dead...\nIf only I had poison...\nThis well would no longer be usable... Ha ha ha!",
      voice: "witch",
      options: [
        createGameInteraction(
          "1",
          "May the God be with you!",
          "God??\nWhat God??\nAre you cursing me???\nYou bastard!\n<Casts a spell that boils your blood>",
          createKillPlayerCallback(),
          (ws) => !ws.didHelpWitch
        ),
      ],
    },
    [
      createGameInteraction(
        "q",
        "Here, take this poison.",
        "What? Really? Ha ha!! Thank you!\nWhat do you want in return?",
        (ws) => {
          ws.didHelpWitch = true;
          ws.isWellPoisoned = true;
          ws.items.delete(POISON.key);
        },
        (ws) => ws.items.has(POISON.key) && !ws.didHelpWitch
      ),
      createGameInteraction(
        "2",
        "I would like an elixir",
        "Fine, take it.",
        (ws) => {
          ws.didChoseWitchReward = true;
          ws.items.add(ELIXIR.key);
        },
        (ws) => ws.didHelpWitch && !ws.didChoseWitchReward
      ),
      createGameInteraction(
        "3",
        "I would like some money",
        "Sure.",
        (ws) => {
          ws.didChoseWitchReward = true;
          ws.coins += 3;
        },
        (ws) => ws.didHelpWitch && !ws.didChoseWitchReward
      ),
    ]
  );

  return witch;
};
