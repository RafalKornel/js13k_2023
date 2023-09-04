export type Vec2 = [x: number, y: number];

export type Direction = "t" | "l" | "d" | "r" | "ul" | "ur";

export type Anchor = "topLeft" | "center";

export type PairKey<Key extends string> = `${Key} | ${Key}`;

export type InteractionActionCallback<TWorldState> = (ws: TWorldState) => void;

export type InteractionResponseCallback<TWorldState> = (
  ws: TWorldState
) => void;

export type InteractionAvailabilityCallback<TWorldState> = (
  ws: TWorldState
) => boolean;

export type Interaction<TWorldState = any> = {
  text: string;
  key: string;
  response: string | InteractionResponseCallback<TWorldState>;
  isAvailable?: InteractionAvailabilityCallback<TWorldState>;
  action?: InteractionActionCallback<TWorldState>;
};

export type TextSize = "m" | "l";

export type BaseWorldState = {
  sceneJumps: number;
};

export type WorldState = Record<string, any> & BaseWorldState;

export type DialogueConfig = {
  init: string;
  options: Array<Interaction>;
};
