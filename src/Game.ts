import { Renderer, RenderEngineParams } from "./Engine/Renderer.ts";
import { InputManager } from "./Engine/InputKey.ts";
import { Player } from "./Engine/Player.ts";
import { CollisionManager } from "./Engine/CollisionManager.ts";
import { CONFIG, SCREEN_HEIGHT, SCREEN_WIDTH } from "./Engine/config.ts";
import { SceneManager } from "./Engine/SceneManager.ts";
import { scenes } from "./scenes.ts";

export class Game extends Renderer {
  player: Player;
  inputManager: InputManager;
  sceneManager: SceneManager;
  collisionManager: CollisionManager;

  constructor(canvas: HTMLCanvasElement, options: RenderEngineParams = {}) {
    super(canvas, options);

    this.inputManager = new InputManager();

    this.player = new Player(
      [this.width / 2, this.height / 2],
      [CONFIG.tileSize, CONFIG.tileSize]
    );

    this.sceneManager = new SceneManager(scenes, "initial");

    this.collisionManager = new CollisionManager(SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  private update() {
    this.player.update(this.inputManager.keysPressed);

    this.sceneManager.update(this.inputManager.keysPressed);

    this.collisionManager.handleEntityCollisions(
      this.player,
      this.sceneManager.scene.children
    );

    this.collisionManager.handleWallsCollision(this.player);
  }

  private render() {
    this.sceneManager.render(this as Renderer);

    this.player.render(this as Renderer);
  }

  loop(): void {
    this.update();
    this.render();
  }
}
