import { AssetKey, AssetsCache, AssetsSize } from "./assets";
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCALE } from "./config";
import { Vec2, Anchor } from "./types";
import { floor, subtract, mult, rnd } from "./utils";

// RENDERING
export function setupRenderer(
  ctx: CanvasRenderingContext2D,
  assets: AssetsCache,
  sizes: AssetsSize
) {
  function clearCanvas() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

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

  function renderImage(
    assetKey: AssetKey,
    pos: Vec2,
    anchor: Anchor = "c",
    rotation: number = 0 // radians
  ) {
    const img: HTMLImageElement | undefined = assets[assetKey];
    const size = sizes[assetKey];

    if (!img) return;

    const scale = SCALE;
    const scaledSize: Vec2 = mult(size, scale);

    // pivot position
    const tPos = floor(
      anchor === "c" ? subtract(pos, mult(scaledSize, 0.5)) : pos
    ) as Vec2;

    ctx.save();

    // move origin to image center
    ctx.translate(tPos[0] + scaledSize[0] / 2, tPos[1] + scaledSize[1] / 2);

    // rotate
    ctx.rotate(rotation);

    // draw centered at origin
    ctx.drawImage(
      img,
      -scaledSize[0] / 2,
      -scaledSize[1] / 2,
      scaledSize[0],
      scaledSize[1]
    );

    ctx.restore();
  }

  let shakeTime = 0;
  let shakeDuration = 0;
  let shakeIntensity = 0;
  let xMod = 0;
  let yMod = 0;

  function startShake(duration: number, intensity: number) {
    shakeDuration = duration;
    shakeIntensity = intensity;
    shakeTime = 0;
    xMod = rnd(0.5, 1); // randomize so X/Y aren’t in sync
    yMod = rnd(0.5, 1);
  }

  /**
   * Call this once per frame *before* drawing your scene.
   */
  function beginShake(dt: number) {
    if (shakeTime >= shakeDuration) return;

    shakeTime += dt;

    const t = shakeTime / shakeDuration; // goes 0 → 1
    const damping = 1 - t; // fade out
    const angle = shakeTime * 50; // oscillation speed
    const offsetX = Math.sin(angle * xMod) * shakeIntensity * damping;
    const offsetY = Math.cos(angle * yMod) * shakeIntensity * damping;

    ctx.save(); // save current transform
    ctx.translate(offsetX, offsetY); // apply shake
  }

  function endShake() {
    if (shakeTime < shakeDuration) {
      ctx.restore(); // undo transform
    }
  }

  return [
    clearCanvas,
    renderRectFill,
    renderRect,
    renderImage,
    startShake,
    beginShake,
    endShake,
  ] as const;
}
