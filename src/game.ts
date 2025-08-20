//@ts-ignore
import compiled from "../assets/compiled/colors?binary-directory";

import { AssetKey, AssetsMap } from "./engine/assets.ts";
import { Anchor, Vec2 } from "./engine/types.ts";
import { SCREEN_WIDTH, SCREEN_HEIGHT, CONFIG } from "./engine/config.ts";
import { floor, getId, mult, rnd, subtract } from "./engine/utils.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#g")!;
const ctx = canvas.getContext("2d")!;

const assets = compiled.assets as AssetsMap;
const colors = compiled.colors as Uint8ClampedArray;

// INITIALIZAION
let raf: number;

const width = SCREEN_WIDTH;
const height = SCREEN_HEIGHT;

canvas.width = width;
canvas.height = height;

if (!ctx) {
  throw new Error("ctx failed");
}

const bpc = 4; // bytes per color
const pixels = new Uint8ClampedArray(width * height * bpc);
const imageData = new ImageData(pixels, width, height);

// CONTROLS
const keysPressed = new Set<string>();

window.addEventListener("keydown", (e) => {
  keysPressed.add(e.key);
});

window.addEventListener("keyup", (e) => {
  keysPressed.delete(e.key);
});

function handleInput(pos: Vec2) {
  const d: Vec2 = [0, 0];
  const v = 1;

  if (keysPressed.has("a")) {
    d[0] -= 1;
  }

  if (keysPressed.has("d")) {
    d[0] += 1;
  }

  if (keysPressed.has("w")) {
    d[1] -= 1;
  }

  if (keysPressed.has("s")) {
    d[1] += 1;
  }

  pos[0] = pos[0] + Math.floor(d[0] * v);
  pos[1] = pos[1] + Math.floor(d[1] * v);
}

// GAME DATA
const positions: Vec2[] = [];
const velocities: Vec2[] = [];
const sprites: AssetKey[] = [];

const PLAYER = getId();
sprites[PLAYER] = "cat";
positions[PLAYER] = [20, 20];
velocities[PLAYER] = [0, 0];

const objects = [getId()];

const spawnObject = (o: number) => {
  sprites[o] = "beer";
  positions[o] = [rnd(width / 8, (width * 7) / 8), 5];
  velocities[o] = [rnd(-CONFIG.g / 2, CONFIG.g / 2), 0];
};

for (const o of objects) {
  spawnObject(o);
}

// RENDERING
function renderRectFill(
  pos: Vec2,
  dim: Vec2,
  color: string,
  anchor: Anchor = "c"
) {
  ctx.fillStyle = color;

  const xOffset = anchor === "c" ? dim[0] / 2 : 0;
  const yOffset = anchor === "c" ? dim[1] / 2 : 0;

  ctx.fillRect(pos[0] - xOffset, pos[1] - yOffset, dim[0], dim[1]);
}

function renderRect(
  pos: Vec2,
  dim: Vec2,
  color: string,
  anchor: Anchor = "c",
  lineWidth: number = 2
) {
  ctx.fillStyle = color;

  const xOffset = anchor === "c" ? dim[0] / 2 : 0;
  const yOffset = anchor === "c" ? dim[1] / 2 : 0;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.rect(pos[0] - xOffset, pos[1] - yOffset, dim[0], dim[1]);

  ctx.stroke();
}

function renderImage(assetKey: AssetKey, pos: Vec2, anchor: Anchor = "c") {
  const [data, size] = assets[assetKey];

  const tPos = floor(anchor === "c" ? subtract(pos, mult(size, 0.5)) : pos);

  const scale = CONFIG.scale;

  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      const srcIdx = x + y * size[0];
      const colorIdx = data[srcIdx];

      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const dstX = tPos[0] + x * scale + sx;
          const dstY = tPos[1] + y * scale + sy;

          const dstIdx = dstX + dstY * width;

          pixels[dstIdx * bpc + 0] += colors[colorIdx * bpc + 0];
          pixels[dstIdx * bpc + 1] += colors[colorIdx * bpc + 1];
          pixels[dstIdx * bpc + 2] += colors[colorIdx * bpc + 2];
          pixels[dstIdx * bpc + 3] += colors[colorIdx * bpc + 3];
        }
      }
    }
  }
}

function render() {
  pixels.fill(0);

  // Order is important
  // Render sprites
  renderImage(sprites[PLAYER], positions[PLAYER], "tl");

  for (const o of objects) {
    renderImage(sprites[o], positions[o], "tl");
  }

  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // Render primitives
  renderRect([0, 0], [width, height], "#ff0000", "tl");
}

function update(dt: number) {
  // handleInput(positions[PLAYER]);

  for (const o of objects) {
    const v = velocities[o];
    const p = positions[o];
    const d = mult(assets[sprites[o]][1], CONFIG.scale);

    // gravity
    v[1] += CONFIG.g * dt;

    const mass = 10;
    const thr = 0.0001;
    const dmpn = 0.8;

    const dv = mass * dt;

    p[0] += v[0] * dv;
    if (p[0] < 0) {
      p[0] = 0;
      v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;
    } else if (p[0] + d[0] > width) {
      p[0] = width - d[0];
      v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;
    }

    p[1] += v[1] * dv;
    if (p[1] < 0) {
      p[1] = 0;
      v[1] = Math.abs(v[1]) < thr ? 0 : v[1] * dmpn * -1;

      v[0] *= dmpn;
    } else if (p[1] + d[1] > height) {
      p[1] = height - d[1];
      v[1] = Math.abs(v[1]) < thr ? 0 : v[1] * dmpn * -1;

      v[0] *= dmpn;
    }
  }

  // console.log({ positions, velocities, sprites });
}

let lastTime = performance.now();

// GAME LOOP
function loop(time: number) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  update(dt);
  render();

  return requestAnimationFrame(loop);
}

function stop() {
  if (!raf) {
    return;
  }

  cancelAnimationFrame(raf);
}

async function start() {
  if (raf) {
    stop();
  }

  raf = loop(0);
}

export { start, stop };
