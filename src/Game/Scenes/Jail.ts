import { Scene } from "../../Engine/Scene/Scene";
import { CONFIG } from "../../Engine/config";
import { Vec2 } from "../../Engine/types";
import { IMAGES_KEY } from "../../assets";
import { NPC } from "../NPC";
import {
  createBrickSceneRenderComponent,
  createScenePositionComponent,
  createSolidEntity,
} from "./helpers";

export const PLAYER_INITIAL_POS: Vec2 = [4, 4];

export const jailScene = new Scene(
  "jail",
  createScenePositionComponent(),
  createBrickSceneRenderComponent(),
  {}
);

const JAIL_WALL_X = 8;
const JAIL_WALL_Y = 6;

const JAIL_DOORS_Y = [4, 8];

const GUARD_POS: Vec2 = [9, 2];
const PRISONER_POS: Vec2 = [4, 7];

for (let y = 1; y < CONFIG.height - 1; y++) {
  if (JAIL_DOORS_Y.includes(y)) {
    continue;
  }

  jailScene.addChild(createSolidEntity([JAIL_WALL_X, y], IMAGES_KEY.pointer));
}

for (let x = 1; x < JAIL_WALL_X; x++) {
  jailScene.addChild(createSolidEntity([x, JAIL_WALL_Y], IMAGES_KEY.pointer));
}

jailScene.addChild(
  new NPC(GUARD_POS, "guard", IMAGES_KEY.hero, { init: "", options: [] }, [])
);

jailScene.addChild(
  new NPC(
    PRISONER_POS,
    "prisoner",
    IMAGES_KEY.hero,
    { init: "", options: [] },
    []
  )
);
