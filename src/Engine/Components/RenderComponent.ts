import { IMAGES_MAP, ImageId } from "../../assets";
import { Renderer } from "../Renderer";
import { Anchor, ImageMetaData } from "../types";
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

export class ImageRenderComponent implements IRenderComponent {
  private _imageData: ImageMetaData;

  constructor(readonly imageId: ImageId) {
    this._imageData = IMAGES_MAP[imageId];
  }

  render(position: IPositionComponent, renderer: Renderer): void {
    renderer.renderImage(this._imageData, position.pos, position.dir);
  }
}
