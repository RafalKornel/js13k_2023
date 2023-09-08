import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS } from "../constants";

class StashScene extends Scene {}

export const createStashScene = () =>
  new StashScene(
    SCENE_KEYS.stash,
    createScenePositionComponent([0, 3], [CONFIG.width - 4, CONFIG.height - 5]),
    createBrickSceneRenderComponent(),
    { l: SCENE_KEYS.tavern }
  );
