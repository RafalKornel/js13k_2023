import { ASSET_KEYS, AssetsMap, size8 } from "../src/engine/assets";
import { ImageMetaData } from "../src/engine/renderer/types";

export async function loadAssets(): Promise<{
  assets: AssetsMap;
  colors: Uint8ClampedArray;
}> {
  const missingAsset = new Uint8ClampedArray(size8[0] * size8[1]);

  const map: Record<string, ImageMetaData> = {};

  for (const assetKey of ASSET_KEYS) {
    let data: Uint8ClampedArray;

    try {
      /** @vite-ignore */
      data = await import(`./compiled/${assetKey}.bin`).then(
        (m) => m.default
      );
    } catch (e) {
      console.error(`Failed loading asset ${assetKey}`);
      console.error(e)
      data = missingAsset;
    }

    map[assetKey] = { data, s: size8 };
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
