import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction } from "../../helpers";
import { HAMMER } from "../../items";

const MASON_KEY = "Mason";

class Mason extends NPC {}

export const createMason = (pos: Vec2) => {
  const mason = new Mason(
    pos,
    MASON_KEY,
    IMAGES_KEY.mason,
    {
      init: "Hello there fellow citizen!\nI have lost my hammer...\nCould you perhaps bring me one?\nWithout it I cannot continue my work...\nPlease, help me, if I don't finish this wall\nmy wife will never recover...",
      options: [],
    },
    [
      createGameInteraction(
        "q",
        "Take this <give hammer>",
        "Thank you very much honorable man!\nHow can I ever repay you?",
        (ws) => {
          ws.items.delete(HAMMER.key);
          ws.didHelpMason = true;
        },
        (ws) => ws.items.has(HAMMER.key) && !ws.didHelpMason
      ),
      createGameInteraction(
        "1",
        "Could you help me and brick up Ernest?",
        "What? Such crime... But I hate this\ngreedy scumbag Ernest... Fine!\nI'll make sure he NEVER leaves his bakery!\nHa ha ha!",
        (ws) => (ws.didMasonKillBaker = true),
        (ws) => ws.didHelpMason && !ws.didMasonKillBaker
      ),
    ]
  );

  return mason;
};
