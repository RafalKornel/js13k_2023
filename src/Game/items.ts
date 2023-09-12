import { IMAGES_KEY } from "../assets";
import { GameWorldState } from "./WorldState";

export const KNIFE = { key: "Knife", price: 1, imageId: IMAGES_KEY.beer };
export const CELL_KEY = { key: "Cell key", price: 0, imageId: IMAGES_KEY.beer };
export const EXIT_KEY = { key: "Exit key", price: 0, imageId: IMAGES_KEY.beer };
export const HAMMER = { key: "Hammer", price: 2, imageId: IMAGES_KEY.hammer };
export const BREAD = {
  key: "Bread",
  price: 2,
  imageId: IMAGES_KEY.bread,
};
export const POISON = { key: "Poison", price: 3, imageId: IMAGES_KEY.beer };
export const ELIXIR = { key: "Elixir", price: 3, imageId: IMAGES_KEY.beer };
export const WATER_BUCKER = {
  key: "Bucket of water",
  price: 1,
  imageId: IMAGES_KEY.bucketWater,
};
export const STASH_KEY = {
  key: "Stash key",
  price: 0,
  imageId: IMAGES_KEY.beer,
};
export const MILK = { key: "Milk", price: 1, imageId: IMAGES_KEY.milk };
export const BEER = {
  key: "Beer",
  price: 2,
  imageId: IMAGES_KEY.beer,
};

export const ITEMS = [
  KNIFE,
  CELL_KEY,
  HAMMER,
  BREAD,
  POISON,
  ELIXIR,
  WATER_BUCKER,
  STASH_KEY,
  MILK,
  BEER,
  EXIT_KEY,
] as const;

export type Item = (typeof ITEMS)[number];

export type ItemKey = Item["key"];

export const buyItem = (
  item: Item,
  getEntity?: (ws: GameWorldState) => Set<ItemKey> | undefined
) => {
  const buyItemCallback = (ws: GameWorldState) => {
    const entity = getEntity?.(ws);

    ws.items.add(item.key);
    ws.coins -= item.price;

    if (entity) {
      entity.delete(item.key);
    }
  };

  const isAvailable = (ws: GameWorldState) => {
    const entity = getEntity?.(ws);

    const hasSufficientMoney = ws.coins >= item.price;
    const alreadyHasItem = ws.items.has(item.key);
    const entityHasItem = entity ? entity?.has(item.key) : true;

    return hasSufficientMoney && !alreadyHasItem && entityHasItem;
  };

  const text = `<Buy ${item.key} (${item.price} coin${
    item.price > 1 ? "s" : ""
  })>`;

  const response = "Here you go!";

  return [text, response, buyItemCallback, isAvailable] as const;
};
