import { game } from "./game.ts";

// GAME LOOP
const [render, update] = game();
let lastTime = performance.now();
let raf: number;

function loop(time: number) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  update(dt);
  render(dt);

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

start();
