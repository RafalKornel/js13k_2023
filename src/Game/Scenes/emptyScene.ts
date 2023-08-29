import { Scene } from "../../Engine/Scene/Scene";
import { createScenePositionComponent } from "../helpers";
import { SCENE_KEYS } from "./constants";

export const createEmptyScene = () =>
  new Scene(SCENE_KEYS.empty, createScenePositionComponent());
