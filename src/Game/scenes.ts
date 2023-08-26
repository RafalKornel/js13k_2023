import { BaseEntity } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { SceneKey, Scene } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import { convertTileVecToGlobal } from "../Engine/utils";
import { IMAGES_KEY } from "../assets";
import { TestInteractableEntity } from "./InteractableEntity";

const createFullScenePositionComponent = () =>
  new PositionComponent(
    convertTileVecToGlobal([0, 0]),
    convertTileVecToGlobal([CONFIG.width, CONFIG.height])
  );

const createBrickSceneRenderComponent = () =>
  new RectRenderComponent("#9e3333", "topLeft");

const createHorizontalTunnel = (left: SceneKey, right: SceneKey): Scene =>
  new Scene(
    `horizontal-${left}-${right}`,
    new PositionComponent(
      convertTileVecToGlobal([0, CONFIG.height / 2 - 1.5]),
      convertTileVecToGlobal([CONFIG.width, CONFIG.height / 4])
    ),
    createBrickSceneRenderComponent(),
    {
      l: left,
      r: right,
    }
  );

const createVerticalTunnel = (top: SceneKey, down: SceneKey): Scene =>
  new Scene(
    `vertical-${top}-${down}`,
    new PositionComponent(
      convertTileVecToGlobal([CONFIG.width / 2 - 2, 0]),
      convertTileVecToGlobal([CONFIG.width / 4, CONFIG.height])
    ),
    createBrickSceneRenderComponent(),
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
  createBrickSceneRenderComponent(),
  {
    l: tunnelAInit.sceneKey,
    r: tunnelInitB.sceneKey,
    t: tunnelCInit.sceneKey,
    d: tunnelInitD.sceneKey,
  }
);

const testInteractionEntity = new TestInteractableEntity();

sceneInitial.addChild(testInteractionEntity);

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
  createBrickSceneRenderComponent(),
  {
    r: tunnelAInit.sceneKey,
  }
);

const sceneB = new Scene(
  "b",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent(),
  {
    l: tunnelInitB.sceneKey,
  }
);

const sceneC = new Scene(
  "c",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent(),
  {
    d: tunnelCInit.sceneKey,
  }
);

const sceneD = new Scene(
  "d",
  createFullScenePositionComponent(),
  createBrickSceneRenderComponent(),
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
