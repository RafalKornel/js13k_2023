import "./style.css";
import { Game } from "./Game.ts";
import { CONFIG } from "./config.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas></canvas>
`;

const game = new Game(document.querySelector<HTMLCanvasElement>("canvas")!, {
  width: CONFIG.width,
  height: CONFIG.height,
});

game.start();
