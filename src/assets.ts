//@ts-ignore
import compiled from "../assets/compiled/colors?binary-directory";
import { bpc } from "./config";
import { Vec2 } from "./types";

export type AssetKey = number;

export const CAT_SPRITE = 0;
export const BEER_SPRITE = 1;
export const SKELETON_SPRITE = 2;

type AssetsArray = Array<[data: Uint8ClampedArray, size: Vec2]>;
export type AssetsCache = Array<HTMLImageElement>;
export type AssetsSize = Array<Vec2>;

export function loadAssets() {
  const assets = compiled.assets as AssetsArray;
  const colors = compiled.colors as Uint8ClampedArray;

  const cache: AssetsCache = [];
  const sizes: AssetsSize = [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  for (let i = 0; i < compiled.assets.length; i++) {
    const [data, size] = assets[i];

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

    cache[i] = img;
    sizes[i] = size;
  }

  return [cache, sizes] as const;
}
