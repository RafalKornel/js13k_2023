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

// ITEMS

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

// @ts-ignore
import bucketEmpty from "../assets/compiled/bucket_empty?binary";

// @ts-ignore
import bucketWater from "../assets/compiled/bucket_water?binary";

// @ts-ignore
import bucketFull from "../assets/compiled/bucket_full?binary";

// @ts-ignore
import sleepingHay1 from "../assets/compiled/sleeping_hay_1?binary";

// @ts-ignore
import sleepingHay2 from "../assets/compiled/sleeping_hay_2?binary";

// @ts-ignore
import tableLeft from "../assets/compiled/table_left?binary";

// @ts-ignore
import tableMiddle from "../assets/compiled/table_middle?binary";

// @ts-ignore
import bread from "../assets/compiled/bread?binary";

// @ts-ignore
import beer from "../assets/compiled/beer?binary";

// @ts-ignore
import milk from "../assets/compiled/milk?binary";

// @ts-ignore
import stool from "../assets/compiled/stool?binary";

// @ts-ignore
import chairSide from "../assets/compiled/chair_side?binary";

// @ts-ignore
import chairFront from "../assets/compiled/chair_front?binary";

// @ts-ignore
import chest1 from "../assets/compiled/chest1?binary";

// @ts-ignore
import chest2 from "../assets/compiled/chest2?binary";

// @ts-ignore
import shelfBooks from "../assets/compiled/shelf_books?binary";

// @ts-ignore
import shelfBread from "../assets/compiled/shelf_bread?binary";

// @ts-ignore
import shelfFood from "../assets/compiled/shelf_food?binary";

// @ts-ignore
import shelfPotion from "../assets/compiled/shelf_potion?binary";

// @ts-ignore
import shelfWine from "../assets/compiled/shelf_wine?binary";

// @ts-ignore
import goldChest from "../assets/compiled/gold_chest?binary";

// @ts-ignore
import laundry from "../assets/compiled/laundry?binary";

// @ts-ignore
import washingPan from "../assets/compiled/washing_pan?binary";

// @ts-ignore
import hammer from "../assets/compiled/hammer?binary";

// @ts-ignore
import cat from "../assets/compiled/cat?binary";

// @ts-ignore
import door from "../assets/compiled/door?binary";

// @ts-ignore
import bed from "../assets/compiled/bed?binary";

// @ts-ignore
import wallUnfinished from "../assets/compiled/wall_unfinished?binary";

// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

import { Vec2 } from "./Engine/types";
import { ImageMetaData } from "./Engine/Renderer/types";

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
  bucketEmpty: 23,
  bucketFull: 24,
  bucketWater: 46,
  sleepingHay1: 25,
  sleepingHay2: 26,
  tableLeft: 27,
  tableMiddle: 28,
  bread: 29,
  beer: 30,
  stool: 31,
  chairSide: 32,
  chairFront: 33,
  chest1: 34,
  chest2: 35,
  shelfBooks: 36,
  shelfBread: 37,
  shelfFood: 38,
  shelfPotion: 39,
  shelfWine: 40,
  cat: 41,
  goldChest: 42,
  furnace: 43,
  laundry: 44,
  washingPan: 45,
  hammer: 47,
  door: 48,
  bed: 49,
  wallUnfinished: 50,
  milk: 51,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const size8: Vec2 = [8, 8];
const tallSize8: Vec2 = [8, 16];
const wideSize8: Vec2 = [16, 8];

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
  [IMAGES_KEY.wallUnfinished]: { data: wallUnfinished, s: size8 },
  [IMAGES_KEY.jailBars]: { data: jailBars, s: size8 },
  [IMAGES_KEY.jailDoor]: { data: jailDoor, s: size8 },
  [IMAGES_KEY.shieldRed]: { data: shieldRed, s: size8 },
  [IMAGES_KEY.bucketEmpty]: { data: bucketEmpty, s: size8 },
  [IMAGES_KEY.bucketFull]: { data: bucketFull, s: size8 },
  [IMAGES_KEY.bucketWater]: { data: bucketWater, s: size8 },
  [IMAGES_KEY.sleepingHay1]: { data: sleepingHay1, s: size8 },
  [IMAGES_KEY.sleepingHay2]: { data: sleepingHay2, s: size8 },
  [IMAGES_KEY.bread]: { data: bread, s: size8 },
  [IMAGES_KEY.beer]: { data: beer, s: size8 },
  [IMAGES_KEY.milk]: { data: milk, s: size8 },
  [IMAGES_KEY.cat]: { data: cat, s: size8 },

  [IMAGES_KEY.tableMiddle]: { data: tableMiddle, s: size8 },
  [IMAGES_KEY.tableLeft]: { data: tableLeft, s: size8 },
  [IMAGES_KEY.stool]: { data: stool, s: size8 },
  [IMAGES_KEY.chairSide]: { data: chairSide, s: size8 },
  [IMAGES_KEY.chairFront]: { data: chairFront, s: size8 },

  [IMAGES_KEY.chest1]: { data: chest1, s: size8 },
  [IMAGES_KEY.chest2]: { data: chest2, s: size8 },

  [IMAGES_KEY.shelfBooks]: { data: shelfBooks, s: tallSize8 },
  [IMAGES_KEY.shelfBread]: { data: shelfBread, s: tallSize8 },
  [IMAGES_KEY.shelfFood]: { data: shelfFood, s: tallSize8 },
  [IMAGES_KEY.shelfPotion]: { data: shelfPotion, s: tallSize8 },
  [IMAGES_KEY.shelfWine]: { data: shelfWine, s: tallSize8 },
  [IMAGES_KEY.furnace]: { data: furnace, s: tallSize8 },

  [IMAGES_KEY.goldChest]: { data: goldChest, s: size8 },
  [IMAGES_KEY.laundry]: { data: laundry, s: wideSize8 },
  [IMAGES_KEY.washingPan]: { data: washingPan, s: size8 },
  [IMAGES_KEY.hammer]: { data: hammer, s: size8 },
  [IMAGES_KEY.door]: { data: door, s: size8 },

  [IMAGES_KEY.bed]: { data: bed, s: size8 },
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
