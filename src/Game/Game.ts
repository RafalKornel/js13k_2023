import { Renderer, RenderEngineParams } from "../Engine/Renderer.ts";
import { InputManager } from "../Engine/InputManager.ts";
import { Player } from "../Engine/Player/Player.ts";
import { CollisionManager } from "../Engine/CollisionManager.ts";
import { SceneManager } from "../Engine/Scene/SceneManager.ts";
import { GameState } from "../Engine/GameState.ts";
import { GameWorldState, getWorldState } from "./WorldState.ts";
import { PLAYER_INITIAL_POS, jailScene } from "./Scenes/Jail.ts";

export class Game extends Renderer {
  player: Player;
  state: GameState<GameWorldState>;

  constructor(
    gameCanvas: HTMLCanvasElement,
    textCanvas: HTMLCanvasElement,
    options: RenderEngineParams = {}
  ) {
    super(gameCanvas, textCanvas, options);

    this.state = new GameState(
      new InputManager(),
      new SceneManager([jailScene]),
      new CollisionManager(),
      getWorldState()
    );

    this.player = new Player(this.state, PLAYER_INITIAL_POS, [1, 1]);
  }

  private update() {
    if (this.state.worldState.isDead) {
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

      this.drawText(
        "You are dead",
        "l",
        this.width / 2,
        this.height / 2,
        "#ff0000"
      );

      return;
    }

    this.state.sceneManager.render(this as Renderer);

    this.player.render(this as Renderer);
  }

  loop(): void {
    this.update();
    this.render();
  }
}
