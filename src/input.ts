import { canvas } from "./config";
import { startShake } from "./render";
import { Vec2 } from "./types";

// CONTROLS
export const keysPressed = new Set<string>();

export let mousePressed: Vec2 | null = null;

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
  startShake(1, 20);
});

window.addEventListener("mouseup", () => {
  if (tmt) {
    clearTimeout(tmt);
  }

  tmt = setTimeout(() => {
    mousePressed = null;
  }, 500);
});
