export type Vec2 = [x: number, y: number];

export type Direction = "t" | "l" | "d" | "r";

export type Anchor = "topLeft" | "center";

export type PairKey<Key extends string> = `${Key} | ${Key}`;

export type ImageId = number;

export type Base64 = string;
