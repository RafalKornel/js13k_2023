import { EntityKey } from "../Engine/BaseEntity";
import { HAMMER, ItemKey } from "./items";

export const getWorldState = () => ({
  items: new Set<ItemKey>(),
  coins: 10,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>([HAMMER.key]),
  killedEntities: new Set<EntityKey>(),
  isDead: false,
  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
  isWellPoisoned: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
