import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBanker } from "./Banker";
import { createMerchant } from "./Merchant";
import { createWitch } from "./Witch";

const WELL_OBJECT_KEY = "well_obj";

class WellScene extends Scene {
  private _isWellPoisoned: boolean = false;

  constructor() {
    super(
      SCENE_KEYS.well,
      createScenePositionComponent(),
      createBrickSceneRenderComponent(),
      {
        l: TUNNELS.wl,
        r: TUNNELS.wr,
        t: TUNNELS.wt,
        d: TUNNELS.wd,
      }
    );

    const [w] = this.dim;

    this.addChild(this.createWell(false));

    this.addChild(createMerchant([2, 3]));
    createTable([1, 4], 4).forEach((tableSegment) => {
      this.addChild(tableSegment);
    });
    this.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [4, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.chest2, [1, 2]));

    this.addChild(createBanker([w - 3, 3]));
    createTable([w - 5, 4], 4).forEach((seg) => this.addChild(seg));
    this.addChild(createSolidEntity(IMAGES_KEY.shelfBooks, [w - 5, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.goldChest, [w - 2, 2]));

    this.addChild(createWitch([13, 9]));
    this.addChild(createSolidEntity(IMAGES_KEY.cat, [14, 9]));
  }

  update(state: GameState<GameWorldState>): void {
    if (state.worldState.isWellPoisoned && !this._isWellPoisoned) {
      this._isWellPoisoned = true;
      this.removeChild(WELL_OBJECT_KEY);

      this.addChild(this.createWell(true));
    }
  }

  private createWell(isPoisoned = false) {
    const [w, h] = this.dim;

    return createSolidEntity(
      isPoisoned ? IMAGES_KEY.wellPoisoned : IMAGES_KEY.wellClean,
      [w / 2, h / 2],
      [1, 2],
      WELL_OBJECT_KEY
    );
  }
}

export const createWellScene = () => new WellScene();
