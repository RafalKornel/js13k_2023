import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { SCENE_KEYS } from "../constants";
import { createBanker } from "./Banker";
import { createMerchant } from "./Merchant";

const WELL_OBJECT_KEY = "well_obj";

class WellScene extends Scene {
  private _isWellPoisoned: boolean = false;

  constructor() {
    super(
      "Well",
      createScenePositionComponent(),
      createBrickSceneRenderComponent(),
      {
        l: SCENE_KEYS.jailTunnel,
      }
    );

    const [w] = this.dim;

    this.addChild(this.createWell(false));

    this.addChild(createMerchant([3, 3]));
    this.addChild(createBanker([w - 4, 3]));
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
      [w / 2 - 1, h / 2 + 2],
      [1, 2],
      WELL_OBJECT_KEY
    );
  }
}

export const createWellScene = () => new WellScene();
