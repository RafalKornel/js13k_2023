import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";

class TavernScene extends Scene {}

export const createTavernScene = () =>
  new TavernScene(
    SCENE_KEYS.tavern,
    createScenePositionComponent([1, 2], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    { d: TUNNELS.wr, r: TUNNELS.st }
  );
