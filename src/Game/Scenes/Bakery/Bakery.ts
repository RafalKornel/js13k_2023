import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { createWall } from "../../Wall";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createOpaqueEntity,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
} from "../../helpers";
import { MASON_KEY } from "../Laundry/Mason";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBaker } from "./Baker";
import { createBeggar } from "./Beggar";

class BakeryScene extends Scene {
  private _didAddMason = false;
  private _didAddBeggar = false;

  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.didMasonKillBaker && !this._didAddMason) {
      this._didAddMason = true;

      this.addChild(createWall([13, 2]));
      this.addChild(createWall([13, 3]));
      this.addChild(createWall([14, 3]));

      this.addChild(
        createSolidEntity(IMAGES_KEY.mason, [12, 2], undefined, MASON_KEY, "l")
      );
    }

    if (state.worldState.isWellPoisoned && !this._didAddBeggar) {
      this.addChild(createBeggar([5, 3.5]));

      this._didAddBeggar = true;
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
  // bakeryScene.addChild(createBeggar([4, 3.5]));

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.wellClean, [12, 7], [1, 2])
  );

  bakeryScene.addChild(createSolidEntity(IMAGES_KEY.furnace, [4, 7], [1, 2]));

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [4, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [6, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [10, 3], [1, 2])
  );

  bakeryScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfBread, [12, 3], [1, 2])
  );

  createTable([7, 8]).forEach((seg) => bakeryScene.addChild(seg));

  bakeryScene.addChild(createOpaqueEntity(IMAGES_KEY.bread, [7.25, 7.375]));
  bakeryScene.addChild(createOpaqueEntity(IMAGES_KEY.bread, [8.875, 7.375]));

  return bakeryScene;
};
