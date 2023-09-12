import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import {
  createBrickSceneRenderComponent,
  createOpaqueEntity,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
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

  doctorOfficeScene.addChild(createDoctor([4.5, 2.875]));

  doctorOfficeScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfPotion, [13, 3], [1, 2])
  );

  doctorOfficeScene.addChild(
    createSolidEntity(IMAGES_KEY.shelfPotion, [11, 3], [1, 2])
  );

  createTable([4, 4]).forEach((seg) => doctorOfficeScene.addChild(seg));
  doctorOfficeScene.addChild(
    createOpaqueEntity(IMAGES_KEY.deadBody, [5, 3.25], [1, 2], undefined)
  );

  doctorOfficeScene.addChild(createSolidEntity(IMAGES_KEY.bed, [13, 9]));
  doctorOfficeScene.addChild(createSolidEntity(IMAGES_KEY.bed, [13, 7]));

  createTable([5, 9], 5).forEach((seg) => doctorOfficeScene.addChild(seg));
  // TODO
  doctorOfficeScene.addChild(createOpaqueEntity(IMAGES_KEY.elixir, [6, 8.5]));
  doctorOfficeScene.addChild(createOpaqueEntity(IMAGES_KEY.poison, [8, 8.5]));

  doctorOfficeScene.addChild(createOpaqueEntity(IMAGES_KEY.skeleton, [3, 8]));

  return doctorOfficeScene;
};
