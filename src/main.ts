import { Game } from "./Game/Game.ts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./Engine/config.ts";
import { loadAssets } from "./assets.ts";

const gameCanvas = document.querySelector<HTMLCanvasElement>("#g")!;
const textCanvas = document.querySelector<HTMLCanvasElement>("#t")!;

async function start() {
  const { assets, colors } = await loadAssets();

  const game = new Game(gameCanvas, textCanvas, colors, assets, {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  game.start();
}

start();
