import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createSuccessfullPickpocketInteraction,
} from "../../helpers";
import { ITEMS, ItemKey, buyItem } from "../../items";

const BANKER_KEY = "Banker";

class Banker extends NPC {}

export const createBanker = (pos: Vec2) => {
  const banker = new Banker(
    pos,
    BANKER_KEY,
    IMAGES_KEY.hero,
    {
      init: "Hello! Do you have anything interesting\nto sell?",
      options: [],
    },
    [
      ...ITEMS.map(({ key, price }, i) => {
        const sellPrice = price > 1 ? price - 1 : price;

        return createGameInteraction(
          `${i + 1}`,
          `<Sell ${key} (${sellPrice} coins)>`,
          `Here you go!`,
          (ws) => {
            const i = key as ItemKey;

            if (!ws.items.has(i)) return;

            ws.items.delete(i);
            ws.banker.add(i);

            ws.coins += sellPrice;
          },
          (ws) => ws.items.has(key as ItemKey)
        );
      }),
      ...ITEMS.map((item, i) =>
        createGameInteraction(`${i + 1}`, ...buyItem(item, (ws) => ws.banker))
      ),
      createSuccessfullPickpocketInteraction(BANKER_KEY, 1),
    ]
  );

  banker.components.position.dir = "l";

  return banker;
};
