import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { PickableItem } from "../../PickableItem";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { BREAD, HAMMER, MILK } from "../../items";
import { SCENE_KEYS } from "../constants";

class StashScene extends Scene {}

export const createStashScene = () => {
  const stash = new StashScene(
    SCENE_KEYS.stash,
    createScenePositionComponent([0, 3], [CONFIG.width - 4, CONFIG.height - 5]),
    createBrickSceneRenderComponent(),
    { l: SCENE_KEYS.tavern }
  );

  stash.addChild(new PickableItem(stash, [6, 4], HAMMER));
  stash.addChild(new PickableItem(stash, [10, 8], BREAD));
  stash.addChild(new PickableItem(stash, [2, 8], MILK));

  return stash;
};
