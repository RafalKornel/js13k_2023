import { BaseEntity } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { SceneKey, Scene } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import {
  Interaction,
  InteractionActionCallback,
  InteractionResponseCallback,
  Vec2,
} from "../Engine/types";
import { add, convertTileVecToGlobal, mult } from "../Engine/utils";
import { ImageId } from "../assets";
import { GameWorldState } from "./WorldState";

export const createScenePositionComponent = (
  pos: Vec2 = [1, 1],
  dim: Vec2 = [CONFIG.width - 2, CONFIG.height - 2]
) =>
  new PositionComponent(
    convertTileVecToGlobal(pos),
    convertTileVecToGlobal(dim)
  );

export const createOffsetPositionComponent = (pos: Vec2, dim: Vec2 = [1, 1]) =>
  new PositionComponent(
    convertTileVecToGlobal(add(pos, mult(dim, 0.5))),
    convertTileVecToGlobal(dim)
  );

export const createSolidEntity = (pos: Vec2, imageId: ImageId) =>
  new BaseEntity({
    position: createOffsetPositionComponent(pos),
    collision: { type: "solid" },
    render: new ImageRenderComponent(imageId),
  });

export const withTimeout = (callback: () => void, time: number = 3000) => {
  setTimeout(callback, time);
};

export function createGameInteraction(
  interaction: Interaction<GameWorldState>
) {
  return interaction;
}

export const createPickpocketInteraction = (
  response: string | InteractionResponseCallback<GameWorldState>,
  action?: InteractionActionCallback<GameWorldState>
): Interaction => ({
  key: "p",
  text: "<pickpocket>",
  response,
  action,
});

export const createKillInteraction = (
  response: string | InteractionResponseCallback<GameWorldState>,
  action?: InteractionActionCallback<GameWorldState>
): Interaction => ({
  key: "k",
  text: "<kill>",
  response,
  action,
});

export const killPlayer = (worldState: GameWorldState) =>
  withTimeout(() => {
    worldState.isDead = true;
  });

export const createFullScenePositionComponent = () =>
  new PositionComponent(
    convertTileVecToGlobal([1, 1]),
    convertTileVecToGlobal([CONFIG.width - 2, CONFIG.height - 2])
  );

export const createBrickSceneRenderComponent = () =>
  new RectRenderComponent("#371415", "topLeft");
// new BackgroundRenderComponent(IMAGES_KEY.floor, dim);

export const createHorizontalTunnel = (
  key: SceneKey,
  left?: SceneKey,
  right?: SceneKey
): Scene =>
  new Scene(
    key,
    createScenePositionComponent(
      [0, CONFIG.height / 2 - 1.5],
      [CONFIG.width, 3]
    ),
    createBrickSceneRenderComponent(),
    {
      l: left,
      r: right,
    }
  );

export const createVerticalTunnel = (
  key: SceneKey,
  top?: SceneKey,
  down?: SceneKey
): Scene =>
  new Scene(
    key,
    createScenePositionComponent(
      [CONFIG.width / 2 - 1.5, 0],
      [3, CONFIG.height]
    ),
    createBrickSceneRenderComponent(),
    {
      t: top,
      d: down,
    }
  );
