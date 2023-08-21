export type Vec2 = [x: number, y: number];

export type CollisionType = "solid" | "opaque" | "none";

export type Bounds = [x: number, y: number, w: number, h: number];

export type Direction = "t" | "l" | "d" | "r";

// export interface BaseEntity1 {
//   pos?: Vec2;
//   dim?: Vec2;
//   // zIndex?: number;
//   children?: BaseEntity[];
//   collision?: CollisionType;
//   render?(ctx: CanvasRenderingContext2D, referenceBound: Bounds): void;
//   update?(...args: any[]): void;
// }
