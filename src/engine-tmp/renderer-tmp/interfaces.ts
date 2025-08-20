import { Anchor, Direction, Vec2 } from "../types";

export interface IRenderer {
  renderImage(
    assetKey: string,
    pos: Vec2,
    dir?: Direction,
    anchor?: Anchor
  ): void;

  renderRectFill(params: {
    pos?: Vec2;
    dim?: Vec2;
    color: string;
    anchor?: Anchor;
  }): void;
}
