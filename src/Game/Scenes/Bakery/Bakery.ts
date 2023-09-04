import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBaker } from "./Baker";
import { createBeggar } from "./Beggar";

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

  bakeryScene.addChild(createBaker([5, 5]));

  bakeryScene.addChild(createBeggar([10, 5]));

  // bakeryScene.addChild(createSolidEntity(IMAGES_KEY.wellClean, []))

  return bakeryScene;
};
