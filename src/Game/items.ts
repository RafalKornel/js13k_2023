export const KNIFE = "knife";
export const CELL_KEY = "cell_key";

const items = [KNIFE, CELL_KEY] as const;

export type Item = (typeof items)[number];

// export type Item = typeof KNIFE;
