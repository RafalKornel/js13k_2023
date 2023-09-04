import { EntityKey } from "../Engine/BaseEntity";
import { BREAD, HAMMER, ItemKey, POISON } from "./items";

export const getWorldState = () => ({
  sceneJumps: 0,
  items: new Set<ItemKey>([]),
  coins: 10,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>([HAMMER.key, POISON.key]),
  baker: new Set<ItemKey>([BREAD.key]),
  killedEntities: new Set<EntityKey>(),
  robbedEntities: new Set<EntityKey>(),
  hasWon: false,
  isDead: false,
  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
  isPlayerDoorOpen: false,
  isGuardAwake: false,
  isWellPoisoned: false,
  isPlayerHelpingBaker: false,
  didHelpWitch: false,
  didChoseWitchReward: false,
  didHelpDoctor: false,
  firstInteractionWithLaundress: 0,
  firstInteractions: new Map<EntityKey, number>(),
});

export type GameWorldState = ReturnType<typeof getWorldState>;
