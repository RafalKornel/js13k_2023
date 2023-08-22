import { Renderer, RenderEngineParams } from "./Engine/Renderer.ts";
import { InputManager } from "./Engine/InputKey.ts";
import { Player } from "./Player.ts";
import { CollisionManager } from "./Engine/CollisionManager.ts";
import { CONFIG } from "./Engine/config.ts";
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
      this,
      [this.width / 2, this.height / 2],
      [CONFIG.tileSize, CONFIG.tileSize]
    );

    this.sceneManager = new SceneManager(scenes[0]);

    scenes.forEach((scene) => {
      this.sceneManager.registerScene(scene);
    });

    this.collisionManager = new CollisionManager();
  }

  private update() {
    this.player.update(this.inputManager.keysPressed);

    this.sceneManager.update(this.inputManager.keysPressed);

    this.collisionManager.handleEntityCollisions(
      this.player,
      this.sceneManager.scene.children
    );

    this.collisionManager.handleWallsCollision(
      this.player,
      this.sceneManager.scene
    );
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
