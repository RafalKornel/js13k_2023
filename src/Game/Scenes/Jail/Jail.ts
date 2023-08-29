import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import { JailDoor } from "./JailDoor";
import { createGuard } from "./Guard";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { PRISONER_KEY, createPrisoner } from "./Prisoner";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { CONFIG } from "../../../Engine/config";

export const PLAYER_INITIAL_POS: Vec2 = [4, 9];

const JAIL_WALL_X = 8;
const JAIL_WALL_Y = 6;

const JAIL_DOORS_X = [1, CONFIG.width - 2];

class JailScene extends Scene {
  update(state: GameState<GameWorldState>): void {
    if (state.worldState.isPrisonerFreed && this.hasChild(PRISONER_KEY)) {
      this.removeChild(PRISONER_KEY);
    }
  }
}

export const createJailScene = () => {
  const jailScene = new JailScene(
    SCENE_KEYS.jail,
    createScenePositionComponent(),
    createBrickSceneRenderComponent(),
    {
      t: TUNNELS.wl,
    }
  );

  const { tilePos, tileDim } = jailScene.components.position;

  for (let y = JAIL_WALL_Y; y <= tileDim[1] - 1; y++) {
    jailScene.addChild(createSolidEntity(IMAGES_KEY.pointer, [JAIL_WALL_X, y]));
  }

  for (let x = tilePos[0] + 1; x < tileDim[0] - 1; x++) {
    if (JAIL_DOORS_X.includes(x)) {
      continue;
    }

    jailScene.addChild(createSolidEntity(IMAGES_KEY.pointer, [x, JAIL_WALL_Y]));
  }

  jailScene.addChild(createGuard());

  jailScene.addChild(createPrisoner());

  const playerCellDoor = new JailDoor("Cell door", [
    JAIL_DOORS_X[0],
    JAIL_WALL_Y,
  ]);

  const prisonedCellDoor = new JailDoor(
    "Prisoner cell door",
    [JAIL_DOORS_X[1], JAIL_WALL_Y],
    (ws) => {
      ws.isPrisonerDoorOpen = true;
    }
  );

  jailScene.addChild(playerCellDoor);
  jailScene.addChild(prisonedCellDoor);

  return jailScene;
};
