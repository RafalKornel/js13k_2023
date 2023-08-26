import { flipImage } from "./Engine/utils";

// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import smile from "../assets/compiled/smile?binary";

// @ts-ignore
import pointer from "../assets/compiled/pointer?binary";

// @ts-ignore
import hero from "../assets/compiled/bohater1?binary";

// @ts-ignore
import floor from "../assets/compiled/floor?binary";

import { ImageMetaData, Vec2 } from "./Engine/types";

const IMAGES_KEY = {
  pointer: 0,
  smile: 1,
  hero: 2,
  floor: 3,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const size8: Vec2 = [8, 8];
const size16: Vec2 = [16, 16];

const IMAGES_MAP: Record<(typeof IMAGES_KEY)[ImageKey], ImageMetaData> = {
  [IMAGES_KEY.pointer]: { l: flipImage(pointer), r: pointer, s: size8 },
  [IMAGES_KEY.smile]: { l: flipImage(smile), r: smile, s: size8 },
  [IMAGES_KEY.hero]: { l: flipImage(hero), r: hero, s: size8 },
  [IMAGES_KEY.floor]: { l: floor, r: floor, s: size16 },
};

const colors = colorsData as Uint8ClampedArray;

[...Object.values(IMAGES_MAP).map(({ l, r }) => [l, r]), colors]
  .flat()
  .forEach((asset) => {
    if (!(asset instanceof Uint8ClampedArray)) {
      throw new Error(`Invalid asset! ${asset}`);
    }
  });

export { IMAGES_KEY, IMAGES_MAP, colors, type ImageKey, type ImageId };
