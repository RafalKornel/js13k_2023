export type Vec2 = [x: number, y: number];

export type Direction = "t" | "l" | "d" | "r";

export type LookDirection = "l" | "r";

export type Anchor = "topLeft" | "center";

export type PairKey<Key extends string> = `${Key} | ${Key}`;

export type ImageMetaData = {
  r: Uint8ClampedArray;
  l: Uint8ClampedArray;
  s: Vec2;
};

export type Interaction = {
  text: string;
  key: string;
  action?: (ws: any) => void;
};

export type TextSize = "m" | "l";

export type WorldState = Record<string, any>;

export type DialogueOption = Interaction & {
  response: string;
};

export type DialogueConfig = {
  init: string;
  options: Array<DialogueOption>;
};
