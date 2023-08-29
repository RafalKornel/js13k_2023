import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";

class LaundryScene extends Scene {}

export const createLaundryScene = () =>
  new LaundryScene(
    SCENE_KEYS.laundry,
    createScenePositionComponent([2, 1], [12, CONFIG.height - 1]),
    createBrickSceneRenderComponent(),
    {
      d: TUNNELS.wt,
    }
  );
