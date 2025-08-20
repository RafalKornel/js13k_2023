import { ImageMetaData } from "./types";

export const ASSET_KEYS = ["cat", "skeleton"] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

export type AssetsMap = Record<AssetKey, ImageMetaData>;
