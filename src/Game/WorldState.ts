import { HAMMER, Item } from "./items";

export const getWorldState = () => ({
  items: new Set<Item>(),
  coins: 2,
  banker: new Set<Item>(),
  merchant: new Set<Item>([HAMMER]),
  isGuardKilled: false,
  isDead: false,
  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
  isWellPoisoned: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
