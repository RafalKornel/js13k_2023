import { Vec2 } from "./types.ts";
import { CONFIG, width } from "./config.ts";
import { getId, rnd } from "./utils.ts";
import { AssetKey } from "./assets.ts";

// export const pixels = new Uint8ClampedArray(width * height * bpc);
// export const imageData = new ImageData(pixels, width, height);

export const positions: Vec2[] = [];
export const velocities: Vec2[] = [];
export const sprites: AssetKey[] = [];
export const rotations: number[] = [];

export const PLAYER = getId();
sprites[PLAYER] = "cat";
positions[PLAYER] = [20, 20];
velocities[PLAYER] = [0, 0];
rotations[PLAYER] = 0;

export const objects = [getId()];

export const spawnObject = (o: number) => {
  sprites[o] = "beer";
  positions[o] = [rnd(width / 8, (width * 7) / 8), 5];
  velocities[o] = [rnd(-CONFIG.g / 2, CONFIG.g / 2), 0];
  rotations[o] = rnd(0, Math.PI * 2);
};

for (const o of objects) {
  spawnObject(o);
}
