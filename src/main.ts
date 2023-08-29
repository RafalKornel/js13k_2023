import { Game } from "./Game/Game.ts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./Engine/config.ts";
import { ASSETS, colors } from "./assets.ts";

const body = document.querySelector("body")!;

body.style.background = "#000";
body.style.margin = "0";

const gameCanvas = document.querySelector<HTMLCanvasElement>("#game")!;
const textCanvas = document.querySelector<HTMLCanvasElement>("#text")!;

const game = new Game(gameCanvas, textCanvas, colors, ASSETS, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

game.start();
