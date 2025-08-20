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

export const convertTileToGlobal = (v: number): number => v * CONFIG.tileSize;

export const convertTileVecToGlobal = (v: Vec2): Vec2 => [
  convertTileToGlobal(v[0]),
  convertTileToGlobal(v[1]),
];

export const OPPOSITE_DIRECTIONS: Partial<Record<Direction, Direction>> = {
  d: "t",
  l: "r",
  r: "l",
  t: "d",
};

export const PORTAL_OFFSET: Partial<Record<Direction, Vec2>> = {
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

export const flipImage = (
  data: Uint8ClampedArray,
  size: Vec2 = [8, 8],
  axis: "x" | "y" = "x"
): Uint8ClampedArray => {
  const copy = [...data];
  const res = new Uint8ClampedArray(data);

  for (let _y = 0; _y < size[1]; _y++) {
    for (let _x = 0; _x < size[0]; _x++) {
      const x = axis === "x" ? size[0] - _x - 1 : _x;
      const y = axis === "x" ? _y : size[1] - _y - 1;

      const i1 = _y * size[0] + _x;
      const i2 = y * size[0] + x;

      res[i1] = copy[i2];
    }
  }

  return res;
};

export const rotate90Deg = (data: Uint8ClampedArray, size: Vec2 = [8, 8]) => {
  const copy = [...data];
  const res = new Uint8ClampedArray(data);

  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      const i1 = y * size[0] + x;
      const i2 = x * size[1] + y;

      res[i1] = copy[i2];
    }
  }

  return res;
};
