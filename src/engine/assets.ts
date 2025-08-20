// NPCS
// @ts-ignore
import cat from "../assets/compiled/cat?binary";

import { Vec2 } from "./types";
import { ImageMetaData } from "./renderer/types";

export const ASSET_KEYS = ["cat"] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

export const size8: Vec2 = [8, 8];

export type AssetsMap = Record<AssetKey, ImageMetaData>;
