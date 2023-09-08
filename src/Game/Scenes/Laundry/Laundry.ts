import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
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

  laundryScene.addChild(createLaundress([4, 4]));
  laundryScene.addChild(createMason([11, 9]));

  return laundryScene;
};
