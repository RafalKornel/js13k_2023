import { Game } from "./Game.ts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./Engine/config.ts";

const body = document.querySelector("body")!;

body.style.background = "#000";
body.style.margin = "0";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

canvas.style.height = "100%";
canvas.style.width = "calc(100vh * 4 / 3)";
// canvas.style.imageRendering = "optimizeSpeed";
canvas.style.imageRendering = "pixelated";

const game = new Game(canvas, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

game.start();
