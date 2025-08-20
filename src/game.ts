//@ts-ignore
import compiled from "../assets/compiled/colors?binary-directory";

import { AssetKey, AssetsMap } from "./engine/assets.ts";
import { Anchor, Vec2 } from "./engine/types.ts";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./engine/config.ts";
import { mult, subtract } from "./engine/utils.ts";

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
const sprites: AssetKey[] = [];

const PLAYER = 0;

positions[PLAYER] = [1, 1];
sprites[PLAYER] = "cat";

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

  const x = pos?.[0] || 0;
  const y = pos?.[1] || 0;

  const w = dim ? Math.min(dim[0], width) : width;

  const h = dim ? Math.min(dim[1], height) : height;

  const xOffset = anchor === "c" ? w / 2 : 0;
  const yOffset = anchor === "c" ? h / 2 : 0;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.rect(x - xOffset, y - yOffset, w, h);

  ctx.stroke();
}

function renderImage(assetKey: AssetKey, pos: Vec2, anchor: Anchor = "c") {
  const [data, size] = assets[assetKey];

  const translatedPos = anchor === "c" ? subtract(pos, mult(size, 0.5)) : pos;

  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      const srcIdx = x + y * size[0];
      const dstIdx = x + translatedPos[0] + (y + translatedPos[1]) * width;

      const colorIdx = data[srcIdx];

      pixels[dstIdx * bpc + 0] = colors[colorIdx * bpc + 0];
      pixels[dstIdx * bpc + 1] = colors[colorIdx * bpc + 1];
      pixels[dstIdx * bpc + 2] = colors[colorIdx * bpc + 2];
      pixels[dstIdx * bpc + 3] = colors[colorIdx * bpc + 3];
    }
  }
}

function render() {
  pixels.fill(0);

  // Order is important
  // Render sprites
  renderImage(sprites[PLAYER], positions[PLAYER], "tl");

  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // Render primitives
  renderRect([0, 0], [width, height], "#ff0000", "tl");
}

function update() {
  handleInput(positions[PLAYER]);
}

// GAME LOOP
function loop() {
  update();
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

  raf = loop();
}

export { start, stop };
