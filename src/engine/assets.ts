// NPCS
// @ts-ignore
import cat from "../assets/compiled/cat?binary";

import { ImageMetaData } from "./renderer/types";

export const SQUARE_ASSETS = ["cat"] as const;

export const TALL_ASSETS = ["skeleton"] as const;

export const ASSET_KEYS = [...SQUARE_ASSETS, ...TALL_ASSETS] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

export type AssetsMap = Record<AssetKey, ImageMetaData>;
