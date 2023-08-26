import { flipImage } from "./Engine/utils";

// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import smile from "../assets/compiled/smile?binary";

// @ts-ignore
import pointer from "../assets/compiled/pointer?binary";

// @ts-ignore
import hero from "../assets/compiled/bohater1?binary";

const IMAGES_KEY = {
  pointer: 0,
  smile: 1,
  hero: 2,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

type ImageData = {
  r: Uint8ClampedArray;
  l: Uint8ClampedArray;
};

const IMAGES_MAP: Record<(typeof IMAGES_KEY)[ImageKey], ImageData> = {
  [IMAGES_KEY.pointer]: { l: flipImage(pointer), r: pointer },
  [IMAGES_KEY.smile]: { l: flipImage(smile), r: smile },
  [IMAGES_KEY.hero]: { l: flipImage(hero), r: hero },
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
