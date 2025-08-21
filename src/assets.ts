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

let rawAssets = compiled.assets as AssetsArray;
let colors = compiled.colors as Uint8ClampedArray;

export const assets: AssetsCache = [];
export const sizes: AssetsSize = [];

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d")!;

for (let i = 0; i < compiled.assets.length; i++) {
  let [data, size] = rawAssets[i];

  canvas.width = size[0];
  canvas.height = size[1];

  let imgBuffer = new Uint8ClampedArray(size[0] * size[1] * bpc);

  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      let i = x + y * size[0];

      let colorIdx = data[i];

      let r = colors[colorIdx * bpc + 0];
      let g = colors[colorIdx * bpc + 1];
      let b = colors[colorIdx * bpc + 2];
      let a = colors[colorIdx * bpc + 3];

      imgBuffer[i * bpc + 0] = r;
      imgBuffer[i * bpc + 1] = g;
      imgBuffer[i * bpc + 2] = b;
      imgBuffer[i * bpc + 3] = a;
    }
  }

  let imgData = new ImageData(imgBuffer, ...size);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.putImageData(imgData, 0, 0);

  let img = new Image(...size);

  img.src = canvas.toDataURL();

  assets[i] = img;
  sizes[i] = size;
}
