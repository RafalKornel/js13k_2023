import { BaseEntity, EntityKey } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { SceneKey, Scene, ConnectedScenes } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import {
  Interaction,
  InteractionActionCallback,
  InteractionResponseCallback,
  Vec2,
} from "../Engine/types";
import { add, mult } from "../Engine/utils";
import { ImageId } from "../assets";
import { GameWorldState } from "./WorldState";
import { KNIFE } from "./items";

export const createScenePositionComponent = (
  pos: Vec2 = [0, 1],
  dim: Vec2 = [CONFIG.width, CONFIG.height - 1]
) => new PositionComponent(pos, dim);

export const createOffsetPositionComponent = (pos: Vec2, dim: Vec2 = [1, 1]) =>
  new PositionComponent(add(pos, mult(dim, 0.5)), dim);

export const createSolidEntity = (
  imageId: ImageId,
  pos: Vec2,
  dim: Vec2 = [1, 1],
  key?: EntityKey
) =>
  new BaseEntity(
    {
      position: createOffsetPositionComponent(pos, dim),
      collision: { type: "solid" },
      render: new ImageRenderComponent(imageId),
    },
    key
  );

export const withTimeout = (callback: () => void, time: number = 3000) => {
  setTimeout(callback, time);
};

type GameInteraction = Interaction<GameWorldState>;

export function createGameInteraction(
  key: GameInteraction["key"],
  text: GameInteraction["text"],
  response: GameInteraction["response"],
  action?: GameInteraction["action"],
  isAvailable?: GameInteraction["isAvailable"]
) {
  return { key, text, response, action, isAvailable };
}

export const createPickpocketInteraction = (
  response: string | InteractionResponseCallback<GameWorldState>,
  action?: InteractionActionCallback<GameWorldState>
): Interaction => ({
  key: "p",
  text: "<Pickpocket>",
  response,
  action,
});

export const createKillInteraction = (
  response: string | InteractionResponseCallback<GameWorldState>,
  action?: InteractionActionCallback<GameWorldState>
): Interaction => ({
  key: "k",
  text: "<Murder>",
  response,
  action,
  isAvailable: (ws: GameWorldState) => ws.items.has(KNIFE),
});

export const createKillPlayerCallback =
  (timeInSeconds: number) => (worldState: GameWorldState) =>
    withTimeout(() => {
      worldState.isDead = true;
    }, timeInSeconds * 1000);

// export const createFullScenePositionComponent = () =>
//   new PositionComponent([1, 1], [CONFIG.width - 2, CONFIG.height - 2]);

export const createBrickSceneRenderComponent = () =>
  new RectRenderComponent("#371415", "topLeft");
// new BackgroundRenderComponent(IMAGES_KEY.floor, dim);

export const createTunnel = (
  key: SceneKey,
  orientation: "h" | "v",
  cs: ConnectedScenes,
  size = 5
) => {
  const offSet = (size - 1) / 2;

  const pos: Vec2 =
    orientation === "h"
      ? [0, CONFIG.height / 2 - offSet]
      : [CONFIG.width / 2 - offSet, 1];

  const dim: Vec2 =
    orientation === "h" ? [CONFIG.width, size] : [size, CONFIG.height - 1];

  return new Scene(
    key,
    createScenePositionComponent(pos, dim),
    createBrickSceneRenderComponent(),
    cs
  );
};

// export const createHorizontalTunnel = (
//   key: SceneKey,
//   cs: ConnectedScenes
// ): Scene =>
//   new Scene(
//     key,
//     createScenePositionComponent([0, CONFIG.height / 2 - 1], [CONFIG.width, 3]),
//     createBrickSceneRenderComponent(),
//     cs
//     // {
//     //   l: left,
//     //   r: right,
//     // }
//   );

// export const createVerticalTunnel = (
//   key: SceneKey,
//   cs: ConnectedScenes
// ): Scene =>
//   new Scene(
//     key,
//     createScenePositionComponent(
//       [CONFIG.width / 2 - 1.5, 0],
//       [3, CONFIG.height]
//     ),
//     createBrickSceneRenderComponent(),
//     cs
//   );
