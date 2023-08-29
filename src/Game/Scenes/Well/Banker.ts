import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction } from "../../helpers";
import { ITEMS, ItemKey } from "../../items";

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
      ...ITEMS.map(({ key: key, price }, i) => {
        const buyPrice = price + 1;

        return createGameInteraction(
          `${i + 1}`,
          `<Buy ${key} (${buyPrice} coins)>`,
          `Here you go!`,
          (ws) => {
            const i = key as ItemKey;

            if (!ws.banker.has(i)) return;

            ws.items.add(key as ItemKey);
            ws.banker.delete(key as ItemKey);

            ws.coins -= buyPrice;
          },
          (ws) => ws.banker.has(key as ItemKey) && ws.coins >= buyPrice
        );
      }),
    ]
  );

  banker.components.position.dir = "l";

  return banker;
};
