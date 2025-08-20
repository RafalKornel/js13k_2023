import { Direction } from "../types";
import { ImageCacheKey } from "./types";

export function getImageCacheKey(
  assetKey: number | string,
  dir: Direction
): ImageCacheKey {
  return `${assetKey} | ${dir}`;
}
