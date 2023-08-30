import { Renderer, RenderEngineParams } from "../Engine/Renderer/Renderer.ts";
import { InputManager } from "../Engine/InputManager.ts";
import { Player } from "../Engine/Player/Player.ts";
import { CollisionManager } from "../Engine/CollisionManager.ts";
import { SceneManager } from "../Engine/Scene/SceneManager.ts";
import { GameState } from "../Engine/GameState.ts";
import { GameWorldState, getWorldState } from "./WorldState.ts";
import { PLAYER_INITIAL_POS, createJailScene } from "./Scenes/Jail/Jail.ts";
import { convertTileVecToGlobal } from "../Engine/utils.ts";
import { createWellScene } from "./Scenes/Well/Well.ts";
import { Assets, Colors } from "../Engine/Renderer/types.ts";
import {
  createStashTavertTunnel,
  createWellBottomTunnel,
  createWellLeftTunnel,
  createWellRightTunnel,
  createWellTopTunnel,
} from "./Scenes/Tunnels.ts";
import { createBakeryScene } from "./Scenes/Bakery/Bakery.ts";
import { createLaundryScene } from "./Scenes/Laundry/Laundry.ts";
import { createTavernScene } from "./Scenes/Tavern/Tavern.ts";
import { createStashScene } from "./Scenes/Stash/Stash.ts";
import { createDoctorOfficeScene } from "./Scenes/DoctorOffice/DoctorOffice.ts";
import { createEmptyScene } from "./Scenes/emptyScene.ts";
import { SCENE_KEYS } from "./Scenes/constants.ts";

const createGameState = () =>
  new GameState(
    new InputManager(),
    new SceneManager([
      createBakeryScene(),
      createJailScene(),
      createWellScene(),
      createDoctorOfficeScene(),
      createTavernScene(),
      createWellLeftTunnel(),
      createWellBottomTunnel(),
      createWellRightTunnel(),
      createWellTopTunnel(),
      createLaundryScene(),
      createStashScene(),
      createStashTavertTunnel(),
      createEmptyScene(),
    ]),
    new CollisionManager(),
    getWorldState()
  );

const createPlayer = (state: GameState) =>
  new Player(state, PLAYER_INITIAL_POS, [1, 1]);

export class Game extends Renderer {
  player: Player;
  state: GameState<GameWorldState>;

  constructor(
    readonly gameCanvas: HTMLCanvasElement,
    readonly textCanvas: HTMLCanvasElement,
    colors: Colors,
    assets: Assets,
    readonly options: RenderEngineParams = {}
  ) {
    super(gameCanvas, textCanvas, colors, assets, options);

    this.state = createGameState();

    console.log(this.state);

    this.player = createPlayer(this.state);
  }

  private update() {
    const ws = this.state.worldState;

    if (ws.isDead) {
      if (!this.player.isKilled) {
        this.player.isKilled = true;
      }

      if (this.state.inputManager.keysPressed.has("r")) {
        this.restart();

        return;
      }

      this.state.sceneManager.changeScene(SCENE_KEYS.empty);
    }

    if (ws.hasWon) {
      if (this.state.inputManager.keysPressed.has("r")) {
        this.restart();

        return;
      }

      this.state.sceneManager.changeScene(SCENE_KEYS.empty);
    }

    this.state.sceneManager.update(this.state);
    this.player.update(this.state);

    this.state.collisionManager.handle(
      this.player,
      this.state.sceneManager.scene
    );
  }

  private render() {
    const ws = this.state.worldState;

    if (ws.isDead) {
      this.renderDeadScreen();
    } else if (ws.hasWon) {
      this.renderWinningScreen();
    } else {
      this.state.sceneManager.render(this as Renderer);

      this.renderUI();
    }

    this.player.render(this as Renderer);
  }

  private renderWinningScreen() {
    this.renderFullScreenMessage(
      "You escaped from the underground!",
      "#00ff00",
      "Can you find different methods of escaping?\nPress R to restart"
    );
  }

  private renderDeadScreen() {
    this.renderFullScreenMessage(
      "You are dead",
      "#ff0000",
      "Press R to restart"
    );
  }

  private renderFullScreenMessage(
    message: string,
    color: string,
    subMessage: string
  ) {
    this.renderRect({
      color: "#000000aa",
      anchor: "topLeft",
    });

    this.drawText(message, "l", this.width / 2, this.height / 2, {
      color: color,
    });

    subMessage.split("\n").forEach((str, i) => {
      this.drawText(str, "m", this.width / 2, this.height / 2 + 10 + i * 3, {
        color: "#ffffff",
      });
    });
  }

  private renderUI() {
    const ws = this.state.worldState;
    const items = [...ws.items.values()];

    this.drawText(
      `Coins: ${ws.coins} | Items: ${items.reduce(
        (p, n, i) => p + (i !== 0 && i !== items.length ? " | " : "") + n,
        ``
      )}`,
      "m",
      ...convertTileVecToGlobal([1, 0.5]),
      { anchor: "left" }
    );
  }

  private restart() {
    this.state = createGameState();
    this.player = createPlayer(this.state);
  }

  loop(): void {
    this.update();
    this.render();
  }
}
