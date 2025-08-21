//@ts-ignore
import compiled from "../assets/compiled/colors?binary-directory";
import { ImageMetaData } from "./types";

export const ASSET_KEYS = ["cat", "skeleton", "beer"] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

export type AssetsMap = Record<AssetKey, ImageMetaData>;

export const assets = compiled.assets as AssetsMap;
export const colors = compiled.colors as Uint8ClampedArray;
