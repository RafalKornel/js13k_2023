//@ts-ignore
import compiled from "../assets/compiled/colors?binary-directory";
import { bpc, SCREEN_HEIGHT, SCREEN_WIDTH } from "./config";
import { ImageMetaData } from "./types";

export const ASSET_KEYS = ["cat", "skeleton", "beer"] as const;

export type AssetKey = (typeof ASSET_KEYS)[number];

export type AssetsMap = Record<AssetKey, ImageMetaData>;
export type AssetsCache = Map<AssetKey, HTMLImageElement>;

export const assets = compiled.assets as AssetsMap;
export const colors = compiled.colors as Uint8ClampedArray;

export const cache: AssetsCache = new Map<AssetKey, HTMLImageElement>();

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;

for (const key of Object.keys(compiled.assets)) {
  const [data, size] = assets[key as AssetKey];

  canvas.width = size[0];
  canvas.height = size[1];

  const imgBuffer = new Uint8ClampedArray(size[0] * size[1] * bpc);

  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      const i = x + y * size[0];

      const colorIdx = data[i];

      const r = colors[colorIdx * bpc + 0];
      const g = colors[colorIdx * bpc + 1];
      const b = colors[colorIdx * bpc + 2];
      const a = colors[colorIdx * bpc + 3];

      imgBuffer[i * bpc + 0] = r;
      imgBuffer[i * bpc + 1] = g;
      imgBuffer[i * bpc + 2] = b;
      imgBuffer[i * bpc + 3] = a;
    }
  }

  const imgData = new ImageData(imgBuffer, ...size);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.putImageData(imgData, 0, 0);

  const img = new Image(...size);

  img.src = canvas.toDataURL();

  console.log(img);

  cache.set(key as AssetKey, img);
}
