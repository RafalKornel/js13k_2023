import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import { Door } from "../../Door";
import { createGuard } from "./Guard";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "../../helpers";
import { PRISONER_KEY, createPrisoner } from "./Prisoner";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { CONFIG } from "../../../Engine/config";
import { CELL_KEY } from "../../items";

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

  for (let y = JAIL_WALL_Y + 1; y <= tileDim[1] - 1; y++) {
    const e = createSolidEntity(IMAGES_KEY.jailBars, [JAIL_WALL_X, y]);
    e.components.position.dir = "t";
    jailScene.addChild(e);
  }

  for (let x = tilePos[0] + 1; x < tileDim[0] - 1; x++) {
    if (JAIL_DOORS_X.includes(x)) {
      continue;
    }

    jailScene.addChild(
      createSolidEntity(IMAGES_KEY.jailBars, [x, JAIL_WALL_Y])
    );
  }

  jailScene.addChild(createGuard());

  jailScene.addChild(createPrisoner());

  const playerCellDoor = new Door(
    "Cell door",
    [JAIL_DOORS_X[0], JAIL_WALL_Y],
    IMAGES_KEY.jailDoor,
    (ws) => ws.items.has(CELL_KEY.key),
    (ws) => {
      ws.isPlayerDoorOpen = true;
    },
    "r"
  );

  const prisonedCellDoor = new Door(
    "Cell door",
    [JAIL_DOORS_X[1], JAIL_WALL_Y],
    IMAGES_KEY.jailDoor,
    (ws) => ws.items.has(CELL_KEY.key),
    (ws) => {
      ws.isPrisonerDoorOpen = true;
    },
    "l"
  );

  const shieldsMetadata = [
    [4, 1, "l"],
    [12, 1, "l"],
    [4, 11, "ur"],
    [12, 11, "ul"],
    [0, 3, "t"],
    [0, 9, "t"],
    [15, 3, "d"],
    [15, 9, "d"],
  ] as const;

  shieldsMetadata.forEach(([x, y, dir]) =>
    jailScene.addChild(
      createSolidEntity(IMAGES_KEY.shieldRed, [x, y], [1, 1], undefined, dir)
    )
  );

  // jailScene.addChild(createSolidEntity(IMAGES_KEY.shieldRed, [11, 1], [1, 1]));

  jailScene.addChild(playerCellDoor);
  jailScene.addChild(prisonedCellDoor);

  return jailScene;
};
