import { GameWorldState } from "./WorldState";

export const KNIFE = { key: "Knife", price: 1 };
export const CELL_KEY = { key: "Cell key", price: 0 };
export const HAMMER = { key: "Hammer", price: 2 };
export const BREAD = { key: "Bread", price: 2 };
export const POISON = { key: "Poison", price: 3 };
export const ELIXIR = { key: "Elixir", price: 3 };
export const WATER_BUCKER = { key: "Bucket of water", price: 1 };
export const STASH_KEY = { key: "Stash key", price: 0 };
export const MILK = { key: "Milk", price: 1 };

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
