import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { CONFIG } from "../../../Engine/config";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import { JailDoor } from "./JailDoor";
import { createGuard } from "../../NPCs/guard";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { PRISONER_KEY, createPrisoner } from "../../NPCs/prisoner";
import { SCENE_KEYS } from "../constants";

export const PLAYER_INITIAL_POS: Vec2 = [4, 4];

const JAIL_WALL_X = 8;
const JAIL_WALL_Y = 6;

const JAIL_DOORS_Y = [5, 9];

const JAIL_SCENE_KEY = "Jail";

class JailScene extends Scene {
  update(state: GameState<GameWorldState>): void {
    if (state.worldState.isPrisonerFreed && this.hasChild(PRISONER_KEY)) {
      this.removeChild(PRISONER_KEY);
    }
  }
}

export const createJailScene = () => {
  const jailScene = new JailScene(
    JAIL_SCENE_KEY,
    createScenePositionComponent(),
    createBrickSceneRenderComponent(),
    { r: SCENE_KEYS.jailTunnel }
  );

  for (let y = 1; y < CONFIG.height - 1; y++) {
    if (JAIL_DOORS_Y.includes(y)) {
      continue;
    }

    jailScene.addChild(createSolidEntity([JAIL_WALL_X, y], IMAGES_KEY.pointer));
  }

  for (let x = 1; x < JAIL_WALL_X; x++) {
    jailScene.addChild(createSolidEntity([x, JAIL_WALL_Y], IMAGES_KEY.pointer));
  }

  jailScene.addChild(createGuard());

  jailScene.addChild(createPrisoner());

  const playerCellDoor = new JailDoor("Cell door", [
    JAIL_WALL_X,
    JAIL_DOORS_Y[0],
  ]);

  const prisonedCellDoor = new JailDoor(
    "Prisoner cell door",
    [JAIL_WALL_X, JAIL_DOORS_Y[1]],
    (ws) => {
      ws.isPrisonerDoorOpen = true;
    }
  );

  jailScene.addChild(playerCellDoor);
  jailScene.addChild(prisonedCellDoor);

  return jailScene;
};