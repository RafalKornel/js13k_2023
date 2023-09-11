import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { createWall } from "../../Wall";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBaker } from "./Baker";
import { createBeggar } from "./Beggar";

class BakeryScene extends Scene {
  private _didAddWalls = false;

  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.didMasonKillBaker && !this._didAddWalls) {
      this._didAddWalls = true;

      this.addChild(createWall([13, 2]));
      this.addChild(createWall([13, 3]));
      this.addChild(createWall([14, 3]));
    }
  }
}

export const createBakeryScene = () => {
  const bakeryScene = new BakeryScene(
    SCENE_KEYS.bakery,
    createScenePositionComponent([1, 1], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    {
      t: TUNNELS.wd,
    }
  );


  bakeryScene.addChild(createBaker([10.25, 6.5]));

  bakeryScene.addChild(createBeggar([4, 3]));

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.wellClean, [12, 7], [1, 2])
  );

  bakeryScene.addChild(createSolidEntity(IMAGES_KEY.furnace, [4, 7], [1, 2]));

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [3, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [5, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [11, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [13, 3], [1, 2])
  );

  createTable([7, 8]).forEach((seg) => bakeryScene.addChild(seg));

  bakeryScene.addChild(createSolidEntity(IMAGES_KEY.bread, [7.25, 7.5]));
  bakeryScene.addChild(createSolidEntity(IMAGES_KEY.bread, [8.75, 7.5]));

  return bakeryScene;
};
