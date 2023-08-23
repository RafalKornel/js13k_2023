import { Renderer } from "../Renderer";
import { Anchor } from "../types";
import { IPositionComponent } from "./PositionComponent";

export interface IRenderComponent {
  render: (position: IPositionComponent, renderer: Renderer) => void;
}

export class RectRenderComponent implements IRenderComponent {
  constructor(public color: string, readonly anchor: Anchor = "center") {}

  render(position: IPositionComponent, renderer: Renderer) {
    renderer.renderRect({
      pos: position.pos,
      dim: position.dim,
      color: this.color,
      anchor: this.anchor,
    });
  }
}
