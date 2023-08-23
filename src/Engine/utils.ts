import { EntityKey } from "./BaseEntity";
import { CONFIG } from "./config";
import { Direction, PairKey, Vec2 } from "./types";

function KeyGenerator() {
  let i = 0;

  const getKey = () => {
    return `${i++}`;
  };

  return { getKey };
}

export const { getKey } = KeyGenerator();

export const getEntityPairKey = (
  aKey: EntityKey,
  bKey: EntityKey
): PairKey<EntityKey> => `${aKey} | ${bKey}`;

export const convertTileToGlobal = (v: number): number => v * CONFIG.tileSize;

export const convertTileVecToGlobal = (v: Vec2): Vec2 => [
  convertTileToGlobal(v[0]),
  convertTileToGlobal(v[1]),
];

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  d: "t",
  l: "r",
  r: "l",
  t: "d",
};

export const PORTAL_OFFSET: Record<Direction, Vec2> = {
  d: [0, -1],
  l: [1, 0],
  r: [-1, 0],
  t: [0, 1],
};

export const add = (v1: Vec2, v2: Vec2): Vec2 => [v1[0] + v2[0], v1[1] + v2[1]];
export const subtract = (v1: Vec2, v2: Vec2): Vec2 => [
  v1[0] - v2[0],
  v1[1] - v2[1],
];
export const mult = (v: Vec2, c: number): Vec2 => [v[0] * c, v[1] * c];
export const len = (v: Vec2) => Math.sqrt(v[0] ** 2 + v[1] ** 2);
