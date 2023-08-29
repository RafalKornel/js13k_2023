// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import smile from "../assets/compiled/smile?binary";

// @ts-ignore
import pointer from "../assets/compiled/pointer?binary";

// @ts-ignore
import hero from "../assets/compiled/bohater1?binary";

// @ts-ignore
import wellClean from "../assets/compiled/well_clean?binary";

// @ts-ignore
import wellPoisoned from "../assets/compiled/well_poisoned?binary";

import { Vec2 } from "./Engine/types";
import { ImageMetaData } from "./Engine/Renderer/types";

const IMAGES_KEY = {
  pointer: 0,
  smile: 1,
  hero: 2,
  wellClean: 3,
  wellPoisoned: 4,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const size8: Vec2 = [8, 8];
// const size16: Vec2 = [16, 16];

const ASSETS: Record<(typeof IMAGES_KEY)[ImageKey], ImageMetaData> = {
  [IMAGES_KEY.pointer]: { data: pointer, s: size8 },
  [IMAGES_KEY.smile]: { data: smile, s: size8 },
  [IMAGES_KEY.hero]: { data: hero, s: size8 },
  [IMAGES_KEY.wellClean]: { data: wellClean, s: [8, 16] },
  [IMAGES_KEY.wellPoisoned]: { data: wellPoisoned, s: [8, 16] },
};

const COLORS = colorsData as Uint8ClampedArray;

[...Object.values(ASSETS).map(({ data }) => data), COLORS]
  .flat()
  .forEach((asset) => {
    if (!(asset instanceof Uint8ClampedArray)) {
      throw new Error(`Invalid asset! ${asset}`);
    }
  });

export { IMAGES_KEY, ASSETS, COLORS as colors, type ImageKey, type ImageId };
