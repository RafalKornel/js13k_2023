import { BaseEntity } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
} from "../Engine/Components/RenderComponent";
import { Scene } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import { convertTileVecToGlobal } from "../Engine/utils";
import { IMAGES_KEY } from "../assets";
import { NPC } from "./NPC";
import { GameWorldState } from "./WorldState";
import { createHorizontalTunnel, createVerticalTunnel, createFullScenePositionComponent, createBrickSceneRenderComponent } from "./Scenes/helpers";

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
