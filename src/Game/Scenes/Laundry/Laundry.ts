import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createLaundress } from "./Laundress";
import { createMason } from "./Mason";

class LaundryScene extends Scene {}

export const createLaundryScene = () => {
  const laundryScene = new LaundryScene(
    SCENE_KEYS.laundry,
    createScenePositionComponent([2, 1], [12, CONFIG.height - 1]),
    createBrickSceneRenderComponent(),
    {
      d: TUNNELS.wt,
    }
  );

  laundryScene.addChild(createLaundress([4, 9]));

  laundryScene.addChild(createSolidEntity(IMAGES_KEY.washingPan, [5.5, 9.25]));

  laundryScene.addChild(createSolidEntity(IMAGES_KEY.bucketWater, [3.5, 7.5]));

  laundryScene.addChild(
    createSolidEntity(IMAGES_KEY.laundry, [3.5, 3], [2, 1])
  );

  laundryScene.addChild(createSolidEntity(IMAGES_KEY.laundry, [10, 9], [2, 1]));

  laundryScene.addChild(createMason([11, 4]));

  return laundryScene;
};
