import { AssetKey } from "../assets";
import { IRenderer } from "../renderer/interfaces";
import { Anchor } from "../types";
import { IPositionComponent } from "./posittion-component";

export interface IRenderComponent {
  render: (position: IPositionComponent, renderer: IRenderer) => void;
}

export class RectRenderComponent implements IRenderComponent {
  constructor(public color: string, readonly anchor: Anchor = "center") {}

  render(position: IPositionComponent, renderer: IRenderer) {
    renderer.renderRectFill({
      pos: position.pos,
      dim: position.dim,
      color: this.color,
      anchor: this.anchor,
    });
  }
}

export class ImageRenderComponent implements IRenderComponent {
  constructor(public assetKey: AssetKey) {}

  render(position: IPositionComponent, renderer: IRenderer): void {
    renderer.renderImage(this.assetKey, position.pos, position.dir);
  }
}
