import { Direction, Vec2 } from "../types";
import { convertTileVecToGlobal } from "../utils";

export interface IPositionComponent {
  tilePos: Vec2;
  tileDim: Vec2;

  pos: Vec2;
  dim: Vec2;
  dir?: Direction;

  get x(): number;
  get y(): number;

  set x(x: number);
  set y(y: number);

  get w(): number;
  get h(): number;

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

  get x() {
    return this.pos[0];
  }

  get y() {
    return this.pos[1];
  }

  set x(x: number) {
    this.pos[0] = x;
  }

  set y(y: number) {
    this.pos[1] = y;
  }

  get w() {
    return this.dim[0];
  }

  get h() {
    return this.dim[1];
  }

  updatePos(x: number, y: number): void {
    this.pos[0] = x;
    this.pos[1] = y;
  }
}
