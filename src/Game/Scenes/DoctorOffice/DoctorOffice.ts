import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
} from "../../helpers";
import { SCENE_KEYS, TUNNELS } from "../constants";

class DoctorOfficeScene extends Scene {}

export const createDoctorOfficeScene = () =>
  new DoctorOfficeScene(
    SCENE_KEYS.doctorOffice,
    createScenePositionComponent([1, 1], [CONFIG.width - 1, CONFIG.height - 2]),
    createBrickSceneRenderComponent(),
    { t: TUNNELS.wr }
  );
