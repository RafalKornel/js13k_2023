import { Renderer, RenderEngineParams } from "../Engine/Renderer/Renderer.ts";
import { InputManager } from "../Engine/InputManager.ts";
import { Player } from "../Engine/Player/Player.ts";
import { CollisionManager } from "../Engine/CollisionManager.ts";
import { SceneManager } from "../Engine/Scene/SceneManager.ts";
import { GameState } from "../Engine/GameState.ts";
import { GameWorldState, getWorldState } from "./WorldState.ts";
import { PLAYER_INITIAL_POS, createJailScene } from "./Scenes/Jail/Jail.ts";
import { add, convertTileVecToGlobal } from "../Engine/utils.ts";
import { createWellScene } from "./Scenes/Well/Well.ts";
import { Assets, Colors } from "../Engine/Renderer/types.ts";
import {
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
import { stopSpeach } from "../Engine/SpeechService.ts";
import { Vec2 } from "../Engine/types.ts";

const RESTART_TEXT = "Press R to restart";

const createGameState = (withMenu: boolean) =>
  new GameState(
    new InputManager(),
    new SceneManager([
      createJailScene(),
      createDoctorOfficeScene(),
      createLaundryScene(),
      createBakeryScene(),
      createTavernScene(),
      createWellScene(),
      createStashScene(),
      createWellLeftTunnel(),
      createWellBottomTunnel(),
      createWellRightTunnel(),
      createWellTopTunnel(),
      createEmptyScene(),
    ]),
    new CollisionManager(),
    getWorldState(withMenu)
  );

const createPlayer = (state: GameState) =>
  new Player(state, PLAYER_INITIAL_POS, [1, 1]);

export class Game extends Renderer {
  player: Player;
  gameState: GameState<GameWorldState>;

  constructor(
    readonly gameCanvas: HTMLCanvasElement,
    readonly textCanvas: HTMLCanvasElement,
    colors: Colors,
    assets: Assets,
    readonly options: RenderEngineParams = {}
  ) {
    super(gameCanvas, textCanvas, colors, assets, options);

    this.gameState = createGameState(true);

    this.gameState.sceneManager.changeScene(SCENE_KEYS.empty);

    this.player = createPlayer(this.gameState);

    stopSpeach();
  }

  private update() {
    const ws = this.gameState.worldState;

    const kp = this.gameState.inputManager.keysPressed;

    if (ws.isMenuScene && kp.has(" ")) {
      this.restart();
    }

    if (ws.isDead) {
      if (!this.player.isKilled) {
        this.player.isKilled = true;
      }

      if (kp.has("r")) {
        this.restart();

        return;
      }

      this.setEmptyScene();
    }

    if (ws.hasWon) {
      if (kp.has("r")) {
        this.restart();

        return;
      }

      this.setEmptyScene();
    }

    this.gameState.sceneManager.update(this.gameState);
    this.player.update(this.gameState);

    this.gameState.collisionManager.handle(
      this.player,
      this.gameState.sceneManager.scene
    );
  }

  setEmptyScene() {
    if (this.gameState.sceneManager.scene.key === SCENE_KEYS.empty) return;

    this.gameState.sceneManager.changeScene(SCENE_KEYS.empty);
  }

  private render() {
    const ws = this.gameState.worldState;

    if (ws.isMenuScene) {
      this.renderMenuScene();
    } else if (ws.isDead) {
      this.renderDeadScreen();
    } else if (ws.hasWon) {
      this.renderWinningScreen();
    } else {
      this.gameState.sceneManager.render(this as Renderer);

      this.renderUI();
    }

    this.player.render(this as Renderer);
  }

  private renderMenuScene() {
    this.renderFullScreenMessage(
      "XIIIth underground district",
      "#d5460d",
      "In XIII century citizens of small town named Kłodzko (formerly known as Glatz or Cladzco)\nstarted expanding their basements. After some time, they managed to create\ncomplex network of rooms, halls and tunnels. In this underground city, they had\nshops, wells, taverns, counting rooms, doctor's office and... prison.\n\nCriminals captured and sent to the prison were then trailed in court, and\noften treated with appropriate kindness by the executioners.\n\nYou are one of those lucky prisoners! Can you escape from the underground maze?\nHow many ways of escaping can you find? And are you ready to die, like a lot?\n\n\nControls: keyboard (WASD)\n\n\nPress SPACE to start",
      [this.width / 2, this.height / 5]
    );

    this.drawText(
      "Created by Rafał Kornel & Małgorzata Kowalczyk for js13kgames 2023",
      "m",
      0,
      this.height - 3,
      { anchor: "left" }
    );
  }

  private renderWinningScreen() {
    this.renderFullScreenMessage(
      "You escaped from the underground!",
      "#00ff00"
    );
  }

  private renderDeadScreen() {
    this.renderFullScreenMessage("You are dead", "#ff0000");
  }

  private renderFullScreenMessage(
    message: string,
    color: string,
    subMessage: string = RESTART_TEXT,
    pos: Vec2 = [this.width / 2, this.height / 2 - 8]
  ) {
    this.renderRect({
      color: "#000000aa",
      anchor: "topLeft",
    });

    this.drawText(message, "l", ...pos, {
      color: color,
    });

    subMessage.split("\n").forEach((str, i) => {
      this.drawText(str, "m", ...add(pos, [0, 10 + i * 3]), {
        color: "#ffffff",
      });
    });
  }

  private renderUI() {
    const ws = this.gameState.worldState;
    const items = [...ws.items.values()];

    this.drawText(
      `Coins: ${ws.coins}`,
      "m",
      ...convertTileVecToGlobal([1, 0.25]),
      { anchor: "left" }
    );

    this.drawText(
      `Items: ${items.reduce(
        (p, n, i) => p + (i !== 0 && i !== items.length ? ", " : "") + n,
        ``
      )}`,
      "m",
      ...convertTileVecToGlobal([1, 0.6]),
      { anchor: "left" }
    );
  }

  private restart() {
    this.gameState = createGameState(false);
    this.player = createPlayer(this.gameState);
    stopSpeach();
  }

  loop(): void {
    this.update();
    this.render();
  }
}
