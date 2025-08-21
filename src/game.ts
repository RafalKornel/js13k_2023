import { G, SCALE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./config.ts";
import { mag, mult } from "./utils.ts";
import { loadAssets } from "./assets.ts";
import {
  objects,
  PLAYER,
  positions,
  rotations,
  setupTestScene,
  spawnObject,
  sprites,
  velocities,
} from "./state.ts";
import { setupRenderer } from "./render.ts";
import { Vec2 } from "./types.ts";

export function game() {
  const canvas = document.querySelector<HTMLCanvasElement>("#g")!;
  const ctx = canvas.getContext("2d")!;

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  const ratio = SCREEN_WIDTH / canvas.clientWidth;

  ctx.imageSmoothingEnabled = false;

  if (!ctx) {
    throw new Error("ctx failed");
  }

  const [assets, sizes] = loadAssets();
  const [
    clearCanvas,
    renderRectFill,
    renderRect,
    renderImage,
    startShake,
    beginShake,
    endShake,
  ] = setupRenderer(ctx, assets, sizes);

  setupTestScene();

  // CONTROLS
  const keysPressed = new Set<string>();

  let mousePressed: Vec2 | null = null;

  window.addEventListener("keydown", (e) => {
    keysPressed.add(e.key);
  });

  window.addEventListener("keyup", (e) => {
    keysPressed.delete(e.key);
  });

  let tmt: NodeJS.Timeout | null = null;

  window.addEventListener("mousedown", (e) => {
    if (e.target !== canvas) {
      return;
    }

    mousePressed = [e.offsetX, e.offsetY] as Vec2;
    startShake(0.5, 10);
  });

  window.addEventListener("mouseup", () => {
    if (tmt) {
      clearTimeout(tmt);
    }

    tmt = setTimeout(() => {
      mousePressed = null;
    }, 500);
  });

  function render(dt: number) {
    clearCanvas();

    beginShake(dt);

    renderImage(sprites[PLAYER], positions[PLAYER], "tl", rotations[PLAYER]);

    for (const o of objects) {
      renderImage(sprites[o], positions[o], "tl", rotations[o]);
    }

    if (mousePressed) {
      renderRectFill(
        mult(mousePressed, ratio),
        [SCALE * 4, SCALE * 4],
        "#00ff00",
        "c"
      );
    }

    endShake();

    renderRect([0, 0], [SCREEN_WIDTH, SCREEN_HEIGHT], "#ff0000", "tl");
  }

  function update(dt: number) {
    rotations[PLAYER] += dt * 0.5;

    if (keysPressed.has("r")) {
      setupTestScene();
    }

    if (keysPressed.has("s")) {
      spawnObject();
    }

    for (const o of objects) {
      const v = velocities[o];
      const p = positions[o];
      const d = mult(sizes[sprites[o]], SCALE);

      // gravity
      v[1] += G * dt;

      const mass = 10;
      const thr = 0.0001;
      const dmpn = 0.8;

      const dv = mass * dt;

      const mg = mag(v);

      p[0] += v[0] * dv;

      let shouldShake = false;

      if (p[0] < 0) {
        p[0] = 0;
        v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;

        shouldShake = true;
      } else if (p[0] + d[0] > SCREEN_WIDTH) {
        p[0] = SCREEN_WIDTH - d[0];
        v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;

        shouldShake = true;
      }

      p[1] += v[1] * dv;

      if (p[1] < 0) {
        p[1] = 0;
        v[1] = Math.abs(v[1]) < thr ? 0 : v[1] * dmpn * -1;

        v[0] *= dmpn;
      } else if (p[1] + d[1] > SCREEN_HEIGHT) {
        p[1] = SCREEN_HEIGHT - d[1];
        v[1] = Math.abs(v[1]) < thr ? 0 : v[1] * dmpn * -1;

        v[0] *= dmpn;

        shouldShake = true;
      }

      if (shouldShake && mg > 1) {
        startShake(0.5, mg / 16);
      }
    }
    // console.log({ positions, velocities, sprites });
  }

  return [render, update] as const;
}
