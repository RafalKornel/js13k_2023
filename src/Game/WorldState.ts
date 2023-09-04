import { EntityKey } from "../Engine/BaseEntity";
import { HAMMER, ItemKey, KNIFE, POISON } from "./items";

export const getWorldState = () => ({
  items: new Set<ItemKey>([KNIFE.key]),
  coins: 10,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>([HAMMER.key, POISON.key]),
  killedEntities: new Set<EntityKey>(),
  hasWon: false,
  isDead: false,
  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
  isWellPoisoned: false,
  isPlayerHelpingBaker: false,
  didHelpWitch: false,
  didChoseWitchReward: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
