import { AssetKey } from "../assets";
import {
  IPositionComponent,
  PositionComponent,
} from "./components/posittion-component";
import {
  ImageRenderComponent,
  IRenderComponent,
} from "./components/render-components";
import { Direction, Vec2 } from "./types";
import { add, mult } from "./utils";

export const createOffsetPositionComponent = (
  pos: Vec2,
  dim: Vec2 = [1, 1],
  dir?: Direction
) => new PositionComponent(add(pos, mult(dim, 0.5)), dim, dir);

export class BaseEntity {
  public readonly renderComponent: IRenderComponent;
  public readonly positionComponent: IPositionComponent;

  constructor(
    public readonly pos: Vec2,
    public readonly name: string,
    public readonly imageId: AssetKey,
    dim?: Vec2,
    dir?: Direction
  ) {
    this.renderComponent = new ImageRenderComponent(imageId);
    this.positionComponent = createOffsetPositionComponent(pos, dim, dir);
  }
}
