import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { PickableItem } from "../../PickableItem";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
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

  
  stash.addChild(new PickableItem(stash, [1, 4], MILK));
  stash.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [2, 4], [1, 2]));
  
  stash.addChild(createSolidEntity(IMAGES_KEY.shelfWine, [5, 4], [1, 2]));
  
  stash.addChild(createSolidEntity(IMAGES_KEY.chest2, [10, 8]));
  stash.addChild(createSolidEntity(IMAGES_KEY.chest2, [8, 8]));
  stash.addChild(createSolidEntity(IMAGES_KEY.chest2, [1, 8]));
  stash.addChild(new PickableItem(stash, [9, 8], HAMMER));
  
  stash.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [8, 4], [1, 2]));
  stash.addChild(new PickableItem(stash, [7, 3.5], BREAD));

  return stash;
};
