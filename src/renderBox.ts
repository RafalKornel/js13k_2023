import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./config.ts";
import { Bounds, Vec2 } from "./types.ts";

type P = {
  ctx: CanvasRenderingContext2D;
  pos: Vec2;
  dim: Vec2;
  color: string;
  anchor?: "topLeft" | "center";
  bounds?: Bounds;
};

export const renderBox = ({
  color,
  ctx,
  dim,
  pos,
  anchor = "center",
  bounds,
}: P) => {
  ctx.fillStyle = color;

  const [x = 0, y = 0, w = SCREEN_WIDTH, h = SCREEN_HEIGHT] = bounds || [];

  const xOffset = anchor === "center" ? dim[0] / 2 : 0;
  const yOffset = anchor === "center" ? dim[1] / 2 : 0;

  ctx.fillRect(
    x + pos[0] - xOffset,
    y + pos[1] - yOffset,
    Math.min(dim[0], w),
    Math.min(dim[1], h)
  );
};
