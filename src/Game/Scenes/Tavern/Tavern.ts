import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { Door } from "../../Door";
import { createWall } from "../../Wall";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { STASH_KEY } from "../../items";
import { SCENE_KEYS, TUNNELS } from "../constants";

class TavernScene extends Scene {}

export const createTavernScene = () => {
  const tavern = new TavernScene(
    SCENE_KEYS.tavern,
    createScenePositionComponent([1, 2], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    { d: TUNNELS.wr, r: SCENE_KEYS.stash }
  );

  tavern.addChild(
    new Door(
      "Stash door",
      [14, 7],
      IMAGES_KEY.jailDoor,
      (ws) => ws.items.has(STASH_KEY.key),
      (ws) => {
        ws.isStashDoorOpen = true;
      }
    )
  );

  tavern.addChild(createWall([14, 6]));
  tavern.addChild(createWall([14, 8]));

  return tavern;
};
