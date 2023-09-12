import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction } from "../../helpers";
import { HAMMER } from "../../items";

export const MASON_KEY = "Mason John";

class Mason extends NPC {}

export const createMason = (pos: Vec2) => {
  const mason = new Mason(
    pos,
    MASON_KEY,
    IMAGES_KEY.mason,
    {
      init: "It's no use...\nWithout my hammer I will never finish\nbricking this damn wall...\nThis cold made my wife sick... My poor Eva!\nI can't even create safe space for her!\nI lost my hammer and I cannot finish this wall...\nFellow citizen, could you bring me my hammer?",
      voice: "maleDeep",
      options: [
        createGameInteraction(
          "1",
          "Could you help me and brick up Ernest?",
          "What? Such crime... But I hate this\ngreedy scumbag Ernest... Fine!\nI'll make sure he NEVER leaves his bakery!\nHa ha ha!",
          (ws) => (ws.didMasonKillBaker = true),
          (ws) => ws.didHelpMason && !ws.didMasonKillBaker && ws.isWellPoisoned
        ),
        createGameInteraction(
          "2",
          "Money perhaps?",
          "I don't have much, but take this.",
          (ws) => (ws.coins += 1),
          (ws) => ws.didHelpMason
        ),
      ],
    },
    [
      createGameInteraction(
        "q",
        "Take this hammer.",
        "Thank you very much honorable man!\nHow can I ever repay you?",
        (ws) => {
          ws.items.delete(HAMMER.key);
          ws.didHelpMason = true;
        },
        (ws) => ws.items.has(HAMMER.key) && !ws.didHelpMason
      ),
    ]
  );

  return mason;
};
