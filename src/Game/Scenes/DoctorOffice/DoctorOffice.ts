import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { DOCTOR_KEY, createDoctor } from "./Doctor";

class DoctorOfficeScene extends Scene {
  update(state: GameState<GameWorldState>): void {
    super.update(state);

    if (state.worldState.willDoctorExamineLaundress) {
      this.removeChild(DOCTOR_KEY);
    }
  }
}

export const createDoctorOfficeScene = () => {
  const doctorOfficeScene = new DoctorOfficeScene(
    SCENE_KEYS.doctorOffice,
    createScenePositionComponent([1, 1], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    { t: TUNNELS.wr }
  );

  doctorOfficeScene.addChild(createDoctor([3, 4]));

  return doctorOfficeScene;
};
