import { Game } from "./game/game.ts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./engine/config.ts";

/** @vite-ignore */
import { loadAssets } from "../assets/load-assets.ts";

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

// IDK why, but roadroller is outputing broken bundle file, in which `gameCanvas` has wrong client width and height.
// This fix apparently works, but I'm not sure why - it seems that canvases are not initialized properly in first event loop pass
setTimeout(() => {
  loadAssets().then(({ assets, colors }) => {
    const game = new Game(gameCanvas, textCanvas, colors, assets, {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    game.start();
  });
}, 10);
