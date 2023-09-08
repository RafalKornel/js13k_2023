import { Vec2 } from "../Engine/types";
import { IMAGES_KEY } from "../assets";
import { createSolidEntity } from "./helpers";

export const createWall = (pos: Vec2) =>
  createSolidEntity(IMAGES_KEY.wall, pos);
