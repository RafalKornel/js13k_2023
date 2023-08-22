import { CONFIG } from "./config";
import { Direction, Vec2 } from "./types";

function KeyGenerator() {
  let i = 0;

  const getKey = () => {
    return `${i++}`;
  };

  return { getKey };
}

export const { getKey } = KeyGenerator();

export const convertTileToGlobal = (v: Vec2): Vec2 => [
  v[0] * CONFIG.tileSize,
  v[1] * CONFIG.tileSize,
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
