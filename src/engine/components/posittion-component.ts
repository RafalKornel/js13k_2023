import { Direction, Vec2 } from "../types";
import { convertTileVecToGlobal } from "../utils";

export interface IPositionComponent {
  tilePos: Vec2;
  tileDim: Vec2;

  pos: Vec2;
  dim: Vec2;
  dir?: Direction;

  updatePos(x: number, y: number): void;
}

export class PositionComponent implements IPositionComponent {
  public pos: Vec2;
  public dim: Vec2;
  constructor(
    public tilePos: Vec2,
    public tileDim: Vec2,
    public dir: Direction = "r"
  ) {
    this.pos = convertTileVecToGlobal(tilePos);
    this.dim = convertTileVecToGlobal(tileDim);
  }

  updatePos(x: number, y: number): void {
    this.pos[0] = x;
    this.pos[1] = y;
  }
}
