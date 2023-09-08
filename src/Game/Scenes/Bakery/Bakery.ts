import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
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

      this.addChild(createSolidEntity(IMAGES_KEY.wall, [13, 2]));
      this.addChild(createSolidEntity(IMAGES_KEY.wall, [13, 3]));
      this.addChild(createSolidEntity(IMAGES_KEY.wall, [14, 3]));
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

  bakeryScene.addChild(createBaker([5, 5]));

  bakeryScene.addChild(createBeggar([10, 5]));

  bakeryScene.addChild(createSolidEntity(IMAGES_KEY.wellClean, [4, 8]));

  return bakeryScene;
};
