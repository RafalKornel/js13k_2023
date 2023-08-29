import { Vec2, Direction } from "../types";

export type ImageMetaData = {
  data: Uint8ClampedArray;
  s: Vec2;
};

export type Assets = Record<number, ImageMetaData>;
export type Colors = Uint8ClampedArray;

export type ImageCacheKey = `${number} | ${Direction}`;
