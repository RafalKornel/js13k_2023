import { EntityKey } from "../Engine/BaseEntity";
import { BREAD, HAMMER, ItemKey, POISON, STASH_KEY } from "./items";

export const getWorldState = () => ({
  hasWon: false,
  isDead: false,

  sceneJumps: 0,

  items: new Set<ItemKey>([STASH_KEY.key]),
  coins: 10,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>([HAMMER.key, POISON.key]),
  baker: new Set<ItemKey>([BREAD.key]),

  firstInteractions: new Map<EntityKey, number>(),
  killedEntities: new Set<EntityKey>(),
  robbedEntities: new Set<EntityKey>(),

  isPrisonerFreed: false,
  isPrisonerDoorOpen: false,
  isPlayerDoorOpen: false,
  isGuardAwake: false,

  isWellPoisoned: false,

  isPlayerHelpingBaker: false,

  didHelpWitch: false,
  didChoseWitchReward: false,

  didHelpDoctor: false,

  didHelpMason: false,
  didMasonKillBaker: false,

  isStashDoorOpen: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
