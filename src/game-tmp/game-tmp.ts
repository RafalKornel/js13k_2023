import { BaseEntity } from "../engine-tmp/base-entity.ts";
import { InputManager } from "../engine-tmp/input-manager.ts";
import { Player } from "../engine-tmp/player.ts";
import {
  CanvasRenderer,
  RenderEngineParams,
} from "../engine-tmp/renderer-tmp/canvas-renderer.ts";
import { IRenderer } from "../engine-tmp/renderer-tmp/interfaces.ts";
import { Assets, Colors } from "../engine-tmp/renderer-tmp/types.ts";

import { stopSpeach } from "../engine-tmp/speech-service.ts";

export class Game extends CanvasRenderer {
  private readonly inputManager = new InputManager();

  private readonly entites: BaseEntity[];
  private readonly cat: Player;

  constructor(
    readonly gameCanvas: HTMLCanvasElement,
    readonly textCanvas: HTMLCanvasElement,
    colors: Colors,
    assets: Assets,
    readonly options: RenderEngineParams
  ) {
    super(gameCanvas, textCanvas, colors, assets, options);

    stopSpeach();

    this.cat = new Player([1, 1], "cat", "cat");

    this.entites = [this.cat];
  }

  private update() {
    this.cat.update(this.inputManager);
  }

  private render() {
    this.entites.forEach((e) => {
      e.renderComponent.render(e.positionComponent, this as IRenderer);
    });

    this.renderUI();
  }

  private renderUI() {
    this.renderRect({
      color: "#ff0000",
      dim: [this.options.width, this.options.height],
      pos: [0, 0],
      anchor: "topLeft",
    });
  }

  private restart() {
    stopSpeach();
  }

  loop(): void {
    this.update();
    this.render();
  }
}
