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

const createGameState = () =>
  new GameState(
    new InputManager(),
    new SceneManager([
      createJailScene(),
      createBakeryScene(),
      createDoctorOfficeScene(),
      createTavernScene(),
      createWellScene(),
      createWellLeftTunnel(),
      createWellBottomTunnel(),
      createWellRightTunnel(),
      createWellTopTunnel(),
      createLaundryScene(),
      createStashScene(),
      createStashTavertTunnel(),
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

    console.log(this.state.worldState);

    this.player = createPlayer(this.state);
  }

  private update() {
    if (this.state.worldState.isDead) {
      if (!this.player.isKilled) {
        this.player.kill();
      }

      if (this.state.inputManager.keysPressed.has("r")) {
        this.restart();
      }

      return;
    }

    this.state.sceneManager.update(this.state);
    this.player.update(this.state);

    this.state.collisionManager.handle(
      this.player,
      this.state.sceneManager.scene
    );
  }

  private render() {
    if (this.state.worldState.isDead) {
      this.renderRect({
        color: "#000000aa",
        anchor: "topLeft",
      });

      this.drawText("You are dead", "l", this.width / 2, this.height / 2, {
        color: "#ff0000",
      });

      this.drawText(
        "Press R to restart",
        "m",
        this.width / 2,
        this.height / 2 + 10,
        {
          color: "#ffffff",
        }
      );
    } else {
      this.state.sceneManager.render(this as Renderer);

      this.renderUI();
    }

    this.player.render(this as Renderer);
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
