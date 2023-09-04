// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import pointer from "../assets/compiled/pointer?binary";

// @ts-ignore
import hero from "../assets/compiled/hero?binary";

// @ts-ignore
import furnace from "../assets/compiled/furnace?binary";

// @ts-ignore
import wall from "../assets/compiled/wall2?binary";

// @ts-ignore
import wellNormal from "../assets/compiled/well_normal?binary";

// @ts-ignore
import wellPoisoned from "../assets/compiled/well_poisoned?binary";

// @ts-ignore
import ghost from "../assets/compiled/ghost?binary";

// @ts-ignore
import jailBars from "../assets/compiled/jail_bars?binary";

// @ts-ignore
import jailDoor from "../assets/compiled/jail_door?binary";

import { Vec2 } from "./Engine/types";
import { ImageMetaData } from "./Engine/Renderer/types";

// const encodeBase64 = (d: string): Uint8ClampedArray =>
//   new Uint8ClampedArray(
//     atob(d)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );

const IMAGES_KEY = {
  pointer: 0,
  hero: 2,
  wellClean: 3,
  wellPoisoned: 4,
  wall: 5,
  ghost: 6,
  jailBars: 7,
  jailDoor: 8,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const size8: Vec2 = [8, 8];
const tallSize8: Vec2 = [8, 16];
// const size16: Vec2 = [16, 16];

const ASSETS: Record<(typeof IMAGES_KEY)[ImageKey], ImageMetaData> = {
  [IMAGES_KEY.pointer]: { data: pointer, s: size8 },
  [IMAGES_KEY.hero]: { data: hero, s: size8 },
  [IMAGES_KEY.wellClean]: { data: wellNormal, s: tallSize8 },
  [IMAGES_KEY.wellPoisoned]: { data: wellPoisoned, s: tallSize8 },
  [IMAGES_KEY.wall]: { data: wall, s: size8 },
  [IMAGES_KEY.ghost]: { data: ghost, s: size8 },
  [IMAGES_KEY.jailBars]: { data: jailBars, s: size8 },
  [IMAGES_KEY.jailDoor]: { data: jailDoor, s: size8 },
};

const COLORS = colorsData as Uint8ClampedArray;

// should remove for build
[...Object.values(ASSETS).map(({ data }) => data), COLORS]
  .flat()
  .forEach((asset) => {
    if (!(asset instanceof Uint8ClampedArray)) {
      throw new Error(`Invalid asset! ${asset}`);
    }
  });

export { IMAGES_KEY, ASSETS, COLORS as colors, type ImageKey, type ImageId };
