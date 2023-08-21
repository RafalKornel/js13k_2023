import { CanvasRenderer, RenderEngineParams } from "./CanvasRenderer.ts";
import { InputManager } from "./InputKey.ts";
import { Player } from "./Player.ts";
import { SceneManager } from "./SceneManager.ts";
import { CollisionManager } from "./CollisionManager.ts";
import { BaseEntity } from "./BaseEntity.ts";
import { CONFIG, SCREEN_HEIGHT, SCREEN_WIDTH } from "./config.ts";
import { CollisionType, Vec2 } from "./types.ts";
import { renderBox } from "./renderBox.ts";

class Block implements BaseEntity {
  pos: Vec2 = [SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2];
  dim: Vec2 = [CONFIG.tileSize, CONFIG.tileSize];
  collisionType: CollisionType = "solid";

  render(ctx: CanvasRenderingContext2D): void {
    renderBox({ ctx, color: "#00ff00", dim: this.dim, pos: this.pos });
  }
}

export class Game extends CanvasRenderer {
  _player: Player;
  _inputManager: InputManager;
  _sceneManager: SceneManager;
  _block: Block = new Block();

  constructor(canvas: HTMLCanvasElement, options: RenderEngineParams = {}) {
    super(canvas, options);

    this._inputManager = new InputManager();

    this._player = new Player(this, [this.width / 2, this.height / 2]);

    this._sceneManager = new SceneManager(this);
  }

  private update() {
    this._player.update(this._inputManager.keysPressed);

    this._sceneManager.update(this._inputManager.keysPressed);

    CollisionManager.handleEntityCollisions(this._player, [
      ...this._sceneManager.chamber.children,
      this._block,
    ]);

    CollisionManager.handleWallsCollision(this._player);
  }

  private render() {
    this._sceneManager.render(this.ctx);

    this._player.render(this.ctx);

    this._block.render(this.ctx);
  }

  loop(): void {
    this.update();
    this.render();
  }
}
