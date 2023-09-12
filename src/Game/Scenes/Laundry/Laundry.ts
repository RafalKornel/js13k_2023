import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import {
  changeEntityImage,
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { DOCTOR_KEY } from "../DoctorOffice/Doctor";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { createLaundress } from "./Laundress";
import { MASON_KEY, createMason } from "./Mason";

class LaundryScene extends Scene {
  private _didAddDoctor = false;
  private _didRemoveMason = false;
  private _didHelpMason = false;

  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.willDoctorExamineLaundress && !this._didAddDoctor) {
      this.addChild(
        createSolidEntity(IMAGES_KEY.doctor, [5.5, 8], [1, 1], DOCTOR_KEY, "l")
      );

      this._didAddDoctor = true;
    }

    if (state.worldState.didMasonKillBaker && !this._didRemoveMason) {
      this.removeChild(MASON_KEY);

      this._didRemoveMason = true;
    }

    if (state.worldState.didHelpMason && !this._didHelpMason) {
      this._didHelpMason = true;

      changeEntityImage(this.children.get("37")!, IMAGES_KEY.wall, "r");
      changeEntityImage(this.children.get("39")!, IMAGES_KEY.wall, "r");
    }
  }
}

export const createLaundryScene = () => {
  const laundryScene = new LaundryScene(
    SCENE_KEYS.laundry,
    createScenePositionComponent([2, 1], [12, CONFIG.height - 1]),
    createBrickSceneRenderComponent(),
    {
      d: TUNNELS.wt,
    }
  );

  changeEntityImage(
    laundryScene.children.get("37")!,
    IMAGES_KEY.wallUnfinished,
    "ur"
  );
  changeEntityImage(
    laundryScene.children.get("39")!,
    IMAGES_KEY.wallUnfinished
  );

  laundryScene.addChild(createLaundress([4, 8]));

  laundryScene.addChild(createSolidEntity(IMAGES_KEY.washingPan, [5.5, 9.25]));

  laundryScene.addChild(createSolidEntity(IMAGES_KEY.bucketWater, [3.5, 9.25]));

  [
    [4, 3],
    [7, 3],
    [10, 3],
    [4, 5],
    [7, 5],
    [10, 5],
  ].forEach((pos) =>
    laundryScene.addChild(
      createSolidEntity(IMAGES_KEY.laundry, pos as Vec2, [2, 1])
    )
  );

  laundryScene.addChild(createMason([12, 8]));

  return laundryScene;
};
