import { GameState } from "../../../Engine/GameState";
import { Scene } from "../../../Engine/Scene/Scene";
import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { GameWorldState } from "../../WorldState";
import { Door } from "../../Door";
import { createGuard } from "./Guard";
import {
  createBrickSceneRenderComponent,
  createOpaqueEntity,
  createScenePositionComponent,
  createSolidEntity,
  createTable,
} from "../../helpers";
import { PRISONER_KEY, createPrisoner } from "./Prisoner";
import { SCENE_KEYS, TUNNELS } from "../constants";
import { CONFIG } from "../../../Engine/config";
import { BEER, BREAD, CELL_KEY } from "../../items";
import { PickableItem } from "../../PickableItem";

export const PLAYER_INITIAL_POS: Vec2 = [4, 9];

const JAIL_WALL_X = 8;
const JAIL_WALL_Y = 6;

const JAIL_DOORS_X = [1, CONFIG.width - 2];

class JailScene extends Scene {
  update(state: GameState<GameWorldState>): void {
    if (state.worldState.didHelpPrisoner && this.hasChild(PRISONER_KEY)) {
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
    "Prisoner cell door",
    [JAIL_DOORS_X[1], JAIL_WALL_Y],
    IMAGES_KEY.jailDoor,
    (ws) => ws.items.has(CELL_KEY.key),
    (ws) => {
      ws.isPrisonerDoorOpen = true;
    },
    "l"
  );

  jailScene.addChild(playerCellDoor);
  jailScene.addChild(prisonedCellDoor);

  const shieldsMetadata = [
    [4, 1, "l"],
    [12, 1, "l"],
  ] as const;

  shieldsMetadata.forEach(([x, y, dir]) =>
    jailScene.addChild(
      createSolidEntity(IMAGES_KEY.shieldRed, [x, y], [1, 1], undefined, dir)
    )
  );

  jailScene.addChild(createSolidEntity(IMAGES_KEY.bucketEmpty, [1, 10]));
  jailScene.addChild(createOpaqueEntity(IMAGES_KEY.sleepingHay1, [3, 10]));

  jailScene.addChild(createOpaqueEntity(IMAGES_KEY.sleepingHay2, [9, 7]));
  jailScene.addChild(createSolidEntity(IMAGES_KEY.bucketFull, [14, 10]));

  jailScene.addChild(createOpaqueEntity(IMAGES_KEY.chairFront, [3, 1.875]));

  jailScene.addChild(createOpaqueEntity(IMAGES_KEY.chairSide, [1, 3]));

  createTable([2, 3]).forEach((seg) => jailScene.addChild(seg));

  jailScene.addChild(new PickableItem(jailScene, [2.25, 2.375], BREAD));
  jailScene.addChild(new PickableItem(jailScene, [4, 2.5], BEER));

  jailScene.addChild(createSolidEntity(IMAGES_KEY.chest2, [14, 2]));

  return jailScene;
};
