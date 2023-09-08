import { EntityKey } from "../Engine/BaseEntity";
import { BREAD, HAMMER, ItemKey, MILK, POISON, STASH_KEY } from "./items";

export const MERCHANT_INVENTORY = [HAMMER, POISON, MILK];

export const getWorldState = () => ({
  hasWon: false,
  isDead: false,

  sceneJumps: 0,

  items: new Set<ItemKey>([STASH_KEY.key]),
  coins: 10,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>(MERCHANT_INVENTORY.map((item) => item.key)),
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

  didHelpDrunkard: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
