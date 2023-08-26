import { LookDirection, Vec2 } from "../types";

export interface IPositionComponent {
  pos: Vec2;
  dim: Vec2;
  dir?: LookDirection;

  get x(): number;
  get y(): number;

  set x(x: number);
  set y(y: number);

  get w(): number;
  get h(): number;

  updatePos(x: number, y: number): void;
}

export class PositionComponent implements IPositionComponent {
  constructor(
    readonly pos: Vec2,
    readonly dim: Vec2,
    public dir: LookDirection = "r"
  ) {}

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
