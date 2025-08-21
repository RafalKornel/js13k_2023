export type Vec2 = [x: number, y: number];

export type Direction = "t" | "l" | "d" | "r" | "ul" | "ur";

export type Anchor = "tl" | "c";

export type Colors = Uint8ClampedArray;

export type ImageCacheKey = `${number | string} | ${Direction}`;
