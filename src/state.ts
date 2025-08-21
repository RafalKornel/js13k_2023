import { Vec2 } from "./types.ts";
import { bpc, CONFIG, height, width } from "./config.ts";
import { getId, rnd } from "./utils.ts";
import { AssetKey } from "./assets.ts";

export const pixels = new Uint8ClampedArray(width * height * bpc);
export const imageData = new ImageData(pixels, width, height);

export const positions: Vec2[] = [];
export const velocities: Vec2[] = [];
export const sprites: AssetKey[] = [];

export const PLAYER = getId();
sprites[PLAYER] = "cat";
positions[PLAYER] = [20, 20];
velocities[PLAYER] = [0, 0];

export const objects = [getId()];

export const spawnObject = (o: number) => {
  sprites[o] = "beer";
  positions[o] = [rnd(width / 8, (width * 7) / 8), 5];
  velocities[o] = [rnd(-CONFIG.g / 2, CONFIG.g / 2), 0];
};

for (const o of objects) {
  spawnObject(o);
}
