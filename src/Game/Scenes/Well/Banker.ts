import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction } from "../../helpers";
import { CELL_KEY, HAMMER, Item, KNIFE } from "../../items";

type BankerInventory = Partial<Record<Item, number>>;

const SELL_PRICES: BankerInventory = {
  [KNIFE]: 2,
  [HAMMER]: 2,
  [CELL_KEY]: 0,
};

const BUY_PRICES: BankerInventory = {
  [KNIFE]: 3,
  [HAMMER]: 3,
  [CELL_KEY]: 1,
};

const BANKER_KEY = "Banker";

class Banker extends NPC {}

export const createBanker = (pos: Vec2) =>
  new Banker(
    pos,
    BANKER_KEY,
    IMAGES_KEY.hero,
    {
      init: "Hello! Do you have anything interesting\nto sell?",
      options: [],
    },
    [
      ...Object.entries(SELL_PRICES).map(([item, price], i) =>
        createGameInteraction(
          `${i + 1}`,
          `<Sell ${item} (${price} coins)>`,
          `Here you go!`,
          (ws) => {
            const i = item as Item;

            if (!ws.items.has(i)) return;

            ws.items.delete(i);
            ws.banker.add(i);

            ws.coins += price;
          },
          (ws) => ws.items.has(item as Item)
        )
      ),
      ...Object.entries(BUY_PRICES).map(([item, price], i) =>
        createGameInteraction(
          `${i + 1}`,
          `<Buy ${item} (${price} coins)>`,
          `Here you go!`,
          (ws) => {
            const i = item as Item;

            if (!ws.banker.has(i)) return;

            ws.items.add(item as Item);
            ws.banker.delete(item as Item);

            ws.coins -= price;
          },
          (ws) => ws.banker.has(item as Item) && ws.coins >= price
        )
      ),
    ]
  );
