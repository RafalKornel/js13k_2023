import { Renderer, RenderEngineParams } from "./Engine/Renderer.ts";
import { InputManager } from "./Engine/InputManager.ts";
import { Player } from "./Player/Player.ts";
import { CollisionManager } from "./Engine/CollisionManager.ts";
import { SceneManager } from "./Engine/SceneManager.ts";
import { scenes } from "./scenes.ts";

export class Game extends Renderer {
  player: Player;
  inputManager: InputManager;
  sceneManager: SceneManager;
  collisionManager: CollisionManager;

  constructor(
    gameCanvas: HTMLCanvasElement,
    textCanvas: HTMLCanvasElement,
    options: RenderEngineParams = {}
  ) {
    super(gameCanvas, textCanvas, options);

    this.inputManager = new InputManager();

    this.sceneManager = new SceneManager(scenes[0]);

    this.player = new Player(this, [this.width / 2, this.height / 2], [1, 1]);

    scenes.forEach((scene) => {
      this.sceneManager.registerScene(scene);
    });

    this.collisionManager = new CollisionManager();
  }

  private update() {
    this.sceneManager.update(this.inputManager);
    this.player.update(this.inputManager);

    this.collisionManager.handle(this.player, this.sceneManager.scene);

    if (this.inputManager.keysPressed.has("e")) {
      this.inputManager.keysPressed.delete("e");
    }
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
