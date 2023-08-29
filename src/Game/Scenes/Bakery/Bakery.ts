import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBaker } from "./Baker";

class BakeryScene extends Scene {}

export const createBakeryScene = () => {
  const bakeryScene = new BakeryScene(
    SCENE_KEYS.bakery,
    createScenePositionComponent([1, 1], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    {
      t: TUNNELS.wd,
    }
  );

  bakeryScene.addChild(createBaker());

  return bakeryScene;
};
