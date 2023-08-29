import { Scene } from "../../../Engine/Scene/Scene";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS } from "../constants";

export const createWellScene = () => {
  const wellScene = new Scene(
    "Well",
    createScenePositionComponent(),
    createBrickSceneRenderComponent(),
    {
      l: SCENE_KEYS.jailTunnel,
    }
  );

  return wellScene;
};
