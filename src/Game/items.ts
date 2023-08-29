export const KNIFE = "Knife";
export const CELL_KEY = "Cell key";
export const HAMMER = "Hammer";

const items = [KNIFE, CELL_KEY, HAMMER] as const;

export type Item = (typeof items)[number];

// export type Item = typeof KNIFE;
