import { EntityKey } from "../Engine/BaseEntity";
import {
  BREAD,
  ELIXIR,
  HAMMER,
  ItemKey,
  MILK,
  POISON,
  WATER_BUCKER,
} from "./items";

export const MERCHANT_INVENTORY = [HAMMER, POISON, ELIXIR, MILK];

export const getWorldState = (withMenu: boolean) => ({
  hasWon: false,
  isDead: false,
  shouldBeKilled: false,
  isMenuScene: withMenu,

  sceneJumps: 0,

  items: new Set<ItemKey>([]),
  coins: 0,
  banker: new Set<ItemKey>(),
  merchant: new Set<ItemKey>(MERCHANT_INVENTORY.map((item) => item.key)),
  baker: new Set<ItemKey>([BREAD.key, WATER_BUCKER.key]),

  firstInteractions: new Map<EntityKey, number>(),
  killedEntities: new Set<EntityKey>(),
  robbedEntities: new Set<EntityKey>(),

  didHelpPrisoner: false,
  isPrisonerDoorOpen: false,
  isPlayerDoorOpen: false,
  isGuardAwake: false,

  isWellPoisoned: false,

  isPlayerHelpingBaker: false,

  didHelpWitch: false,
  didChoseWitchReward: false,

  willDoctorExamineLaundress: false,

  didHelpMason: false,
  didMasonKillBaker: false,

  isStashDoorOpen: false,

  didHelpDrunkard: false,

  didHelpDoctor: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
