import { CONFIG, ratio, height, width } from "./config.ts";
import { mag, mult } from "./utils.ts";
import { mousePressed } from "./input.ts";
import { assets } from "./assets.ts";
import { objects, PLAYER, positions, rotations, sprites, velocities } from "./state.ts";
import {
  renderImage,
  renderRectFill,
  renderRect,
  clearCanvas,
  beginShake,
  endShake,
  startShake,
} from "./render.ts";

export function render(dt: number) {
  clearCanvas();

  beginShake(dt);

  renderImage(sprites[PLAYER], positions[PLAYER], "tl", rotations[PLAYER]);

  for (const o of objects) {
    renderImage(sprites[o], positions[o], "tl", rotations[o]);
  }

  if (mousePressed) {
    renderRectFill(
      mult(mousePressed, ratio),
      [CONFIG.scale * 4, CONFIG.scale * 4],
      "#00ff00",
      "c"
    );
  }

  endShake();

  renderRect([0, 0], [width, height], "#ff0000", "tl");
}

export function update(dt: number) {

  rotations[PLAYER] += dt * 0.5;

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

    const mg = mag(v);

    p[0] += v[0] * dv;

    let shouldShake = false;

    if (p[0] < 0) {
      p[0] = 0;
      v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;

      shouldShake = true;
    } else if (p[0] + d[0] > width) {
      p[0] = width - d[0];
      v[0] = Math.abs(v[0]) < thr ? 0 : v[0] * dmpn * -1;

      shouldShake = true;
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

      shouldShake = true;
    }

    if (shouldShake) {
      startShake(0.5, mg / 16);
    }
  }

  // console.log({ positions, velocities, sprites });
}
