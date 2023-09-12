import { Game } from "./Game/Game.ts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./Engine/config.ts";
import { ASSETS, colors } from "./assets.ts";

// const body = document.querySelector("body")!;

// body.style.background = "#000";
// body.style.margin = "0";

const gameCanvas = document.querySelector<HTMLCanvasElement>("#g")!;
const textCanvas = document.querySelector<HTMLCanvasElement>("#t")!;

// IDK why, but roadroller is outputing broken bundle file, in which `gameCanvas` has wrong client width and height.
// This fix apparently works, but I'm not sure why - it seems that canvases are not initialized properly in first event loop pass
setTimeout(() => {
  const game = new Game(gameCanvas, textCanvas, colors, ASSETS, {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  game.start();
}, 10);
