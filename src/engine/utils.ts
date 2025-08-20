import { Vec2 } from "./types";

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
  return data;
};

export const rotate90Deg = (data: Uint8ClampedArray, size: Vec2 = [8, 8]) => {
  return data;
};
