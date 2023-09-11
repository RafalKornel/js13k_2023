// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import furnace from "../assets/compiled/furnace?binary";

// @ts-ignore
import wall from "../assets/compiled/wall2?binary";

// @ts-ignore
import wellNormal from "../assets/compiled/well_normal?binary";

// @ts-ignore
import wellPoisoned from "../assets/compiled/well_poisoned?binary";

// @ts-ignore
import jailBars from "../assets/compiled/jail_bars?binary";

// @ts-ignore
import jailDoor from "../assets/compiled/jail_door?binary";

// @ts-ignore
import shieldRed from "../assets/compiled/shield_red?binary";

// NPCS

// @ts-ignore
import ghost from "../assets/compiled/ghost?binary";

// @ts-ignore
import baker from "../assets/compiled/baker?binary";

// @ts-ignore
import banker from "../assets/compiled/banker?binary";

// @ts-ignore
import beggar from "../assets/compiled/beggar?binary";

// @ts-ignore
import drunkard from "../assets/compiled/drunkard?binary";

// @ts-ignore
import doctor from "../assets/compiled/doctor?binary";

// @ts-ignore
import executioner from "../assets/compiled/executioner?binary";

// @ts-ignore
import guard from "../assets/compiled/guard?binary";

// @ts-ignore
import innkeeper from "../assets/compiled/innkeeper?binary";

// @ts-ignore
import laundress from "../assets/compiled/laundress?binary";

// @ts-ignore
import mason from "../assets/compiled/mason?binary";

// @ts-ignore
import merchant from "../assets/compiled/mason?binary";

// @ts-ignore
import merchant from "../assets/compiled/merchant?binary";

// @ts-ignore
import player from "../assets/compiled/player?binary";

// @ts-ignore
import prisoner from "../assets/compiled/prisoner?binary";

// @ts-ignore
import witch from "../assets/compiled/witch?binary";

import { Vec2 } from "./Engine/types";
import { ImageMetaData } from "./Engine/Renderer/types";

// const encodeBase64 = (d: string): Uint8ClampedArray =>
//   new Uint8ClampedArray(
//     atob(d)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );

const IMAGES_KEY = {
  player: 2,
  wellClean: 3,
  wellPoisoned: 4,
  wall: 5,
  ghost: 6,
  jailBars: 7,
  jailDoor: 8,
  shieldRed: 9,
  baker: 10,
  beggar: 11,
  drunkard: 12,
  executioner: 13,
  guard: 14,
  innkeeper: 15,
  laundress: 16,
  mason: 17,
  merchant: 18,
  prisoner: 19,
  witch: 20,
  banker: 21,
  doctor: 22,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const size8: Vec2 = [8, 8];
const tallSize8: Vec2 = [8, 16];
// const size16: Vec2 = [16, 16];

const ASSETS: Record<(typeof IMAGES_KEY)[ImageKey], ImageMetaData> = {
  [IMAGES_KEY.player]: { data: player, s: size8 },
  [IMAGES_KEY.ghost]: { data: ghost, s: size8 },
  [IMAGES_KEY.baker]: { data: baker, s: size8 },
  [IMAGES_KEY.drunkard]: { data: drunkard, s: size8 },
  [IMAGES_KEY.beggar]: { data: beggar, s: size8 },
  [IMAGES_KEY.executioner]: { data: executioner, s: size8 },
  [IMAGES_KEY.guard]: { data: guard, s: size8 },
  [IMAGES_KEY.innkeeper]: { data: innkeeper, s: size8 },
  [IMAGES_KEY.laundress]: { data: laundress, s: size8 },
  [IMAGES_KEY.mason]: { data: mason, s: size8 },
  [IMAGES_KEY.merchant]: { data: merchant, s: size8 },
  [IMAGES_KEY.prisoner]: { data: prisoner, s: size8 },
  [IMAGES_KEY.banker]: { data: banker, s: size8 },
  [IMAGES_KEY.merchant]: { data: merchant, s: size8 },
  [IMAGES_KEY.doctor]: { data: doctor, s: size8 },
  [IMAGES_KEY.witch]: { data: witch, s: size8 },
  [IMAGES_KEY.wellClean]: { data: wellNormal, s: tallSize8 },
  [IMAGES_KEY.wellPoisoned]: { data: wellPoisoned, s: tallSize8 },
  [IMAGES_KEY.wall]: { data: wall, s: size8 },
  [IMAGES_KEY.jailBars]: { data: jailBars, s: size8 },
  [IMAGES_KEY.jailDoor]: { data: jailDoor, s: size8 },
  [IMAGES_KEY.shieldRed]: { data: shieldRed, s: size8 },
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
