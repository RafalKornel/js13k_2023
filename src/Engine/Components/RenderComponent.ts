import { IMAGES_MAP, ImageId } from "../../assets";
import { Renderer } from "../Renderer";
import { Anchor, ImageMetaData, Vec2 } from "../types";
import { convertTileVecToGlobal } from "../utils";
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

// TODO potentially remove
export class BackgroundRenderComponent implements IRenderComponent {
  private _imageData: ImageMetaData;

  constructor(readonly imageId: ImageId, readonly dim: Vec2) {
    const imageData = IMAGES_MAP[imageId];

    const { s } = imageData;

    const globalDim = convertTileVecToGlobal(dim);

    const scaledImageData = new Uint8ClampedArray(globalDim[0] * globalDim[1]);

    for (let y = 0; y < globalDim[1]; y++) {
      for (let x = 0; x < globalDim[0]; x++) {
        const imgY = y % s[1];
        const imgX = x % s[0];

        const v = imageData.data[imgY * s[1] + imgX];

        scaledImageData[y * globalDim[0] + x] = v;
      }
    }

    this._imageData = {
      data: scaledImageData,
      s: globalDim,
    };
  }

  render(position: IPositionComponent, renderer: Renderer) {
    renderer.renderImage(
      this._imageData,
      position.pos,
      position.dir,
      "topLeft"
    );
  }
}
