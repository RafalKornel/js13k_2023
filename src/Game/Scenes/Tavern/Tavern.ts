import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { Door } from "../../Door";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createOpaqueEntity,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
  createWall,
} from "../../helpers";
import { STASH_KEY } from "../../items";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { DRUNKARD_KEY, createDrunkard } from "./Drunkard";
import { createInnkeeper } from "./Innkeeper";
import { createPrisoner } from "./Prisoner";

class TavernScene extends Scene {
  private _didPrisonerCome = false;

  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.didHelpDrunkard) {
      this.removeChild(DRUNKARD_KEY);
    }

    if (state.worldState.didHelpPrisoner && !this._didPrisonerCome) {
      this._didPrisonerCome = true;
      this.addChild(createPrisoner([2, 10]));
    }
  }
}

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
      IMAGES_KEY.door,
      (ws) => ws.items.has(STASH_KEY.key),
      (ws) => {
        ws.isStashDoorOpen = true;
      }
    )
  );

  tavern.addChild(createWall([14, 6]));
  tavern.addChild(createWall([14, 8]));

  createTable([11, 4], 4).forEach((seg) => tavern.addChild(seg));
  tavern.addChild(createInnkeeper([11.5, 3]));
  tavern.addChild(
    createOpaqueEntity(IMAGES_KEY.chairSide, [14, 3], undefined, undefined, "l")
  );
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.beer, [13, 3.5]));

  tavern.addChild(createSolidEntity(IMAGES_KEY.shelfWine, [9.75, 3], [1, 2]));
  tavern.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [8.5, 3], [1, 2]));
  tavern.addChild(createSolidEntity(IMAGES_KEY.shelfWine, [7.25, 3], [1, 2]));
  tavern.addChild(createSolidEntity(IMAGES_KEY.shelfWine, [14, 9], [1, 2]));

  createTable([3.5, 4.5], 2).forEach((seg) => tavern.addChild(seg));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.stool, [5.625, 4.372]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.stool, [2.375, 4.372]));
  tavern.addChild(createDrunkard([3.75, 3.375]));

  createTable([7, 7], 3).forEach((seg) => tavern.addChild(seg));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.stool, [5.875, 6.875]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.stool, [10.125, 6.875]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.chairFront, [7, 6]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.chairFront, [9, 6]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.beer, [8, 6.5]));

  createTable([3, 10], 3).forEach((seg) => tavern.addChild(seg));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.beer, [4, 9.5]));
  tavern.addChild(
    createOpaqueEntity(IMAGES_KEY.chairSide, [6, 10], undefined, undefined, "l")
  );

  tavern.addChild(createOpaqueEntity(IMAGES_KEY.chairFront, [3, 9]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.chairFront, [5, 9]));
  tavern.addChild(createOpaqueEntity(IMAGES_KEY.chairSide, [2, 10]));

  return tavern;
};
