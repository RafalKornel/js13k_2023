import { BaseEntity } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { SceneKey, Scene } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import { Vec2 } from "../Engine/types";
import { convertTileVecToGlobal } from "../Engine/utils";
import { IMAGES_KEY } from "../assets";
import { NPC } from "./NPC";
import { GameWorldState } from "./WorldState";

const createFullScenePositionComponent = () =>
  new PositionComponent(
    convertTileVecToGlobal([0, 0]),
    convertTileVecToGlobal([CONFIG.width, CONFIG.height])
  );

const createBrickSceneRenderComponent = (dim: Vec2) =>
  new RectRenderComponent("#371415", "topLeft");
// new BackgroundRenderComponent(IMAGES_KEY.floor, dim);

const createHorizontalTunnel = (left: SceneKey, right: SceneKey): Scene =>
  new Scene(
    `horizontal-${left}-${right}`,
    new PositionComponent(
      convertTileVecToGlobal([0, CONFIG.height / 2 - 1.5]),
      convertTileVecToGlobal([CONFIG.width, 3])
    ),
    createBrickSceneRenderComponent([CONFIG.width, 3]),
    {
      l: left,
      r: right,
    }
  );

const createVerticalTunnel = (top: SceneKey, down: SceneKey): Scene =>
  new Scene(
    `vertical-${top}-${down}`,
    new PositionComponent(
      convertTileVecToGlobal([CONFIG.width / 2 - 1.5, 0]),
      convertTileVecToGlobal([3, CONFIG.height])
    ),
    createBrickSceneRenderComponent([3, CONFIG.height]),
    {
      t: top,
      d: down,
    }
  );

const tunnelAInit = createHorizontalTunnel("a", "initial");
const tunnelCInit = createVerticalTunnel("c", "initial");
const tunnelInitB = createHorizontalTunnel("initial", "b");
const tunnelInitD = createVerticalTunnel("initial", "d");

const sceneInitial = new Scene(
  "initial",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent([CONFIG.width, CONFIG.height]),
  {
    l: tunnelAInit.sceneKey,
    r: tunnelInitB.sceneKey,
    t: tunnelCInit.sceneKey,
    d: tunnelInitD.sceneKey,
  }
);

const johnTestInteractionEntity = new NPC(
  [4, 4],
  "John",
  IMAGES_KEY.hero,
  {
    init: "Hello brave advenruter!\nWhat can I do for you?",
    options: [
      {
        key: "1",
        text: "Give me a beer!",
        response: "I'm not giving you any beer!\nYou are drunk already!!",
      },
      {
        key: "2",
        text: "Do you know anything about John?",
        response: "I am John!",
      },
    ],
  },
  [
    {
      key: "p",
      text: "<pickpocket>",
      action: (ws: GameWorldState) => {
        ws.isDead = true;
      },
    },
    {
      key: "k",
      text: "<kill>",
      action: (ws: GameWorldState) => {
        ws.isDead = true;
      },
    },
  ]
);

sceneInitial.addChild(johnTestInteractionEntity);

const renderTest = new BaseEntity({
  position: new PositionComponent(
    convertTileVecToGlobal([12, 3]),
    convertTileVecToGlobal([2, 2])
  ),
  render: new ImageRenderComponent(IMAGES_KEY.floor),
  collision: { type: "solid" },
});

sceneInitial.addChild(renderTest);

const sceneA = new Scene(
  "a",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent([CONFIG.width, CONFIG.height]),
  {
    r: tunnelAInit.sceneKey,
  }
);

const sceneB = new Scene(
  "b",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent([CONFIG.width, CONFIG.height]),
  {
    l: tunnelInitB.sceneKey,
  }
);

const sceneC = new Scene(
  "c",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent([CONFIG.width, CONFIG.height]),
  {
    d: tunnelCInit.sceneKey,
  }
);

const sceneD = new Scene(
  "d",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent([CONFIG.width, CONFIG.height]),
  {
    t: tunnelInitD.sceneKey,
  }
);

export const scenes: Scene[] = [
  sceneInitial,
  sceneA,
  sceneB,
  sceneC,
  sceneD,
  tunnelAInit,
  tunnelCInit,
  tunnelInitB,
  tunnelInitD,
];
