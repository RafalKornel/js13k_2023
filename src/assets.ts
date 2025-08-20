// NPCS
// @ts-ignore
import cat from "../assets/compiled/cat?binary";

import { Vec2 } from "./engine-tmp/types";
import { ImageMetaData } from "./engine-tmp/renderer-tmp/types";

export const ASSET_KEYS = ["cat"] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

const size8: Vec2 = [8, 8];

type AssetsMap = Record<AssetKey, ImageMetaData>;

export async function loadAssets(): Promise<{
  assets: AssetsMap;
  colors: Uint8ClampedArray;
}> {
  const missingAsset = new Uint8ClampedArray(size8[0] * size8[1]);

  const map: Record<string, ImageMetaData> = {};

  for (const assetKey of ASSET_KEYS) {
    let data: Uint8ClampedArray;

    try {
      data = await import(`../assets/compiled/${assetKey}?binary`).then(
        (m) => m.default
      );
    } catch (e) {
      console.error("Failed loading asset");
      data = missingAsset;
    }

    map[assetKey] = { data, s: size8 };
  }

  const colorsPath = `../assets/compiled/colors?binary` as string;

  /* @vite-ignore */
  const colors = await import(colorsPath)
    .then((m) => m.default)
    .catch((e) => {
      console.error(
        "Colors could not be initialized. Did you run complie script?"
      );

      throw e;
    });

  const result = { assets: map as AssetsMap, colors };

  console.log("Assets loaded successfully!", result);

  return result;
}
