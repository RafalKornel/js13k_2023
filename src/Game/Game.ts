import { Renderer, RenderEngineParams } from "../Engine/Renderer.ts";
import { InputManager } from "../Engine/InputManager.ts";
import { Player } from "../Engine/Player/Player.ts";
import { CollisionManager } from "../Engine/CollisionManager.ts";
import { SceneManager } from "../Engine/Scene/SceneManager.ts";
import { scenes } from "./scenes.ts";
import { GameState } from "../Engine/GameState.ts";

export class Game extends Renderer {
  player: Player;
  state: GameState;

  constructor(
    gameCanvas: HTMLCanvasElement,
    textCanvas: HTMLCanvasElement,
    options: RenderEngineParams = {}
  ) {
    super(gameCanvas, textCanvas, options);

    this.state = new GameState(
      new InputManager(),
      new SceneManager(scenes),
      new CollisionManager()
    );

    this.player = new Player(
      this.state,
      [this.width / 2, this.height / 2],
      [1, 1]
    );
  }

  private update() {
    this.state.sceneManager.update(this.state);
    this.player.update(this.state);

    this.state.collisionManager.handle(
      this.player,
      this.state.sceneManager.scene
    );
  }

  private render() {
    this.state.sceneManager.render(this as Renderer);

    this.player.render(this as Renderer);
  }

  loop(): void {
    this.update();
    this.render();
  }
}
