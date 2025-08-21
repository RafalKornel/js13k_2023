import { Vec2 } from "./types.ts";
import { G, SCREEN_WIDTH } from "./config.ts";
import { rnd } from "./utils.ts";
import { AssetKey, BEER_SPRITE, CAT_SPRITE } from "./assets.ts";

let id = 0;
const getId = () => id++;

export const PLAYER = getId();

export const positions: Vec2[] = [];
export const velocities: Vec2[] = [];
export const sprites: AssetKey[] = [];
export const rotations: number[] = [];

export let objects: number[] = [];

export const spawnObject = () => {
  const o = getId();

  objects.push(o);

  sprites[o] = BEER_SPRITE;
  positions[o] = [rnd(SCREEN_WIDTH / 8, (SCREEN_WIDTH * 7) / 8), 5];
  velocities[o] = [rnd(-G / 2, G / 2), 0];
  rotations[o] = rnd(0, Math.PI * 2);

  return o;
};

export function setupTestScene() {
  sprites[PLAYER] = CAT_SPRITE;
  positions[PLAYER] = [20, 20];
  velocities[PLAYER] = [0, 0];
  rotations[PLAYER] = 0;

  objects = [];

  const objCount = 2;

  for (let i = 0; i < objCount; i++) {
    spawnObject();
  }
}
