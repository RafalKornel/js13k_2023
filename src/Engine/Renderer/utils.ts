import { Direction } from "../types";
import { ImageCacheKey } from "./types";

export function getImageCacheKey(
  imageId: number,
  dir: Direction
): ImageCacheKey {
  return `${imageId} | ${dir}`;
}
