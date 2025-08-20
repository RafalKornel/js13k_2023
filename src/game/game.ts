import { BaseEntity } from "../engine/base-entity.ts";
import { InputManager } from "../engine/input-manager.ts";
import { Player } from "../engine/player.ts";
import {
  CanvasRenderer,
  RenderEngineParams,
} from "../engine/renderer/canvas-renderer.ts";
import { IRenderer } from "../engine/renderer/interfaces.ts";
import { Assets, Colors } from "../engine/renderer/types.ts";

import { stopSpeach } from "../engine/speech-service.ts";

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
