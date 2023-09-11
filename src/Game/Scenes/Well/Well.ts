import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { IMAGES_KEY } from "../../../assets";
import { Door } from "../../Door";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createOpaqueEntity,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
} from "../../helpers";
import { EXIT_KEY } from "../../items";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createBanker } from "./Banker";
import { createGuard } from "./Guard";
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

    this.addChild(createOpaqueEntity(IMAGES_KEY.stool, [6.5, 6.5]));
    this.addChild(createOpaqueEntity(IMAGES_KEY.stool, [9.5, 6.5]));

    this.addChild(createMerchant([3.75, 3]));
    createTable([1, 4], 5).forEach((tableSegment) => {
      this.addChild(tableSegment);
    });
    this.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [5, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.shelfFood, [1, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.chest2, [2.25, 2]));

    this.addChild(createBanker([w - 4.25, 3]));
    createTable([w - 6, 4], 5).forEach((seg) => this.addChild(seg));
    this.addChild(createSolidEntity(IMAGES_KEY.shelfBooks, [w - 6, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.shelfBooks, [w - 2, 2.5]));
    this.addChild(createSolidEntity(IMAGES_KEY.goldChest, [w - 3, 2]));

    this.addChild(createWitch([13, 10]));
    this.addChild(createSolidEntity(IMAGES_KEY.cat, [14, 10]));

    this.addChild(createSolidEntity(IMAGES_KEY.wall, [1, 9]));
    this.addChild(createSolidEntity(IMAGES_KEY.wall, [2, 9]));
    this.addChild(createSolidEntity(IMAGES_KEY.wall, [3, 9]));
    this.addChild(createSolidEntity(IMAGES_KEY.wall, [4, 9]));
    this.addChild(createSolidEntity(IMAGES_KEY.wall, [5, 9]));

    this.addChild(
      new Door(
        "Exit",
        [1, 10],
        IMAGES_KEY.door,
        (ws) => ws.items.has(EXIT_KEY.key),
        (ws) => {
          ws.hasWon = true;
        }
      )
    );

    this.addChild(createGuard([6, 9]));
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
