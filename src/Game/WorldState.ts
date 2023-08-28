import { Item } from "./items";

export const getWorldState = () => ({
  items: new Set<Item>(),
  isGuardKilled: false,
  isDead: false,
  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
