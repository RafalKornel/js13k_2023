import { assets, colors, AssetKey } from "./assets";
import { ctx, CONFIG, width, bpc, height } from "./config";
import { imageData, pixels } from "./state";
import { Vec2, Anchor } from "./types";
import { floor, subtract, mult, rnd } from "./utils";

// RENDERING
export function clearCanvas() {
  pixels.fill(0);
  ctx.clearRect(0, 0, width, height);
}

export function flushBuffer(dt: number) {
  const buffer = applyShake(pixels, dt);

  imageData.data.set(buffer);
  ctx.putImageData(imageData, 0, 0);
}

export function renderRectFill(
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

export function renderRect(
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

export function renderImage(
  assetKey: AssetKey,
  pos: Vec2,
  anchor: Anchor = "c"
) {
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

let shakeTime = 0;
let shakeDuration = 0;
let shakeIntensity = 0;
let xMod = 0;
let yMod = 0;

export function startShake(duration: number, intensity: number) {
  shakeDuration = duration;
  shakeIntensity = intensity;
  shakeTime = 0;
  xMod = rnd(0.5, 1);
  yMod = rnd(0.5, 1);
}
/**
 * Call each frame to apply smooth shake.
 */
export function applyShake(
  pixels: Uint8ClampedArray,
  dt: number
): Uint8ClampedArray {
  if (shakeTime >= shakeDuration) return pixels;

  shakeTime += dt;

  const t = shakeTime / shakeDuration; // 0 → 1
  const damping = 1 - t; // linear decay
  const angle = shakeTime * 50; // speed of oscillation
  const offsetX = Math.sin(angle * xMod) * shakeIntensity * damping;
  const offsetY = Math.cos(angle * yMod) * shakeIntensity * damping;

  const shaken = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = Math.round(x - offsetX);
      const srcY = Math.round(y - offsetY);

      const dstIdx = (x + y * width) * bpc;

      if (srcX < 0 || srcX >= width || srcY < 0 || srcY >= height) {
        shaken[dstIdx + 0] = 0;
        shaken[dstIdx + 1] = 0;
        shaken[dstIdx + 2] = 0;
        shaken[dstIdx + 3] = 255;
      } else {
        const srcIdx = (srcX + srcY * width) * bpc;
        shaken[dstIdx + 0] = pixels[srcIdx + 0];
        shaken[dstIdx + 1] = pixels[srcIdx + 1];
        shaken[dstIdx + 2] = pixels[srcIdx + 2];
        shaken[dstIdx + 3] = pixels[srcIdx + 3];
      }
    }
  }

  return shaken;
}
