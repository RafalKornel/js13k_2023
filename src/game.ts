import { G, SCALE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./config.ts";
import { mag, mult } from "./utils.ts";
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
import {
  beginShake,
  canvas,
  clearCanvas,
  endShake,
  ratio,
  renderImage,
  renderRect,
  renderRectFill,
  startShake,
} from "./render.ts";
import { Vec2 } from "./types.ts";
import { sizes } from "./assets.ts";

// CONTROLS
let mousePressed: Vec2 | null = null;

export let init = () => {
  let KP = "keypress" as const;
  let MD = "mousedown" as const;

  setupTestScene();

  let keypress = (e: KeyboardEvent) => {
    if (e.key === "r") {
      setupTestScene();
    }
    if (e.key === "s") {
      spawnObject();
    }
  };

  window.addEventListener(KP, keypress);

  let tmt: NodeJS.Timeout | null = null;

  let mousedown = (e: MouseEvent) => {
    if (e.target !== canvas) {
      return;
    }

    mousePressed = [e.offsetX, e.offsetY] as Vec2;
    startShake(0.5, 10);

    if (tmt) {
      clearTimeout(tmt);
    }

    tmt = setTimeout(() => {
      mousePressed = null;
    }, 500);
  };

  window.addEventListener(MD, mousedown);

  return () => {
    window.removeEventListener(KP, keypress);
    window.removeEventListener(MD, mousedown);
  };
};

export let render = (dt: number) => {
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
};

export let update = (dt: number) => {
  rotations[PLAYER] += dt * 0.5;

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
};
