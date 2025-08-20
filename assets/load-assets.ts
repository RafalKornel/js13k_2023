import { ASSET_KEYS, AssetsMap, TALL_ASSETS } from "../src/engine/assets";
import { ImageMetaData } from "../src/engine/renderer/types";
import { Vec2 } from "../src/engine/types";

const UNIT = 8;

export async function loadAssets(): Promise<{
  assets: AssetsMap;
  colors: Uint8ClampedArray;
}> {
  const missingAsset = new Uint8ClampedArray(UNIT * UNIT);

  const map: Record<string, ImageMetaData> = {};

  for (const assetKey of ASSET_KEYS) {
    try {
      /** @vite-ignore */
      const data = await import(`./compiled/${assetKey}.bin`).then(
        (m) => m.default
      );
      const size = TALL_ASSETS.includes(assetKey as any) ? [8, 16] : [8, 8];

      map[assetKey] = { data, s: size as Vec2 };
    } catch (e) {
      console.error(`Failed loading asset ${assetKey}`);
      console.error(e);
      map[assetKey] = { data: missingAsset, s: [UNIT, UNIT] };
    }
  }

  /** @vite-ignore */
  const colors = await import(`./compiled/colors.bin` as string)
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
