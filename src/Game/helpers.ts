import { BaseEntity, EntityKey } from "../Engine/BaseEntity";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { SceneKey, Scene, ConnectedScenes } from "../Engine/Scene/Scene";
import { CONFIG } from "../Engine/config";
import {
  Direction,
  Interaction,
  InteractionActionCallback,
  InteractionAvailabilityCallback,
  Vec2,
} from "../Engine/types";
import { add, mult } from "../Engine/utils";
import { IMAGES_KEY, ImageId } from "../assets";
import { GameWorldState } from "./WorldState";
import { EXIT_KEY, ItemKey, KNIFE } from "./items";

export const createScenePositionComponent = (
  pos: Vec2 = [0, 1],
  dim: Vec2 = [CONFIG.width, CONFIG.height - 1]
) => new PositionComponent(pos, dim);

export const createOffsetPositionComponent = (
  pos: Vec2,
  dim: Vec2 = [1, 1],
  dir?: Direction
) => new PositionComponent(add(pos, mult(dim, 0.5)), dim, dir);

export const createSolidEntity = (
  imageId: ImageId,
  pos: Vec2,
  dim: Vec2 = [1, 1],
  key?: EntityKey,
  dir?: Direction
) =>
  new BaseEntity(
    {
      position: createOffsetPositionComponent(pos, dim, dir),
      collision: { type: "solid" },
      render: new ImageRenderComponent(imageId),
    },
    key
  );

export const createOpaqueEntity = (
  imageId: ImageId,
  pos: Vec2,
  dim: Vec2 = [1, 1],
  key?: EntityKey,
  dir?: Direction
) =>
  new BaseEntity(
    {
      position: createOffsetPositionComponent(pos, dim, dir),
      collision: { type: "none" },
      render: new ImageRenderComponent(imageId),
    },
    key
  );

export const withTimeout = (
  callback: () => void,
  timeInSeconds: number = 3
) => {
  setTimeout(callback, timeInSeconds * 1000);
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
  entityKey: EntityKey,
  response: string,
  action?: InteractionActionCallback<GameWorldState>,
  isAvailable?: InteractionAvailabilityCallback<GameWorldState>
): Interaction => ({
  key: "p",
  text: "<Pickpocket>",
  response,
  action: (ws: GameWorldState) => {
    if (ws.robbedEntities.has(entityKey)) return;

    ws.robbedEntities.add(entityKey);

    return action?.(ws);
  },
  isAvailable: (ws) =>
    !ws.robbedEntities.has(entityKey) && (isAvailable ? isAvailable(ws) : true),
});

export const createSuccessfullPickpocketInteraction = (
  entityKey: EntityKey,
  reward: number | ItemKey,
  isAvailable?: InteractionAvailabilityCallback<GameWorldState>
) =>
  createPickpocketInteraction(
    entityKey,
    `<You steal ${typeof reward === "number" ? `${reward} coins` : reward}>`,
    (ws) => {
      if (typeof reward === "number") {
        ws.coins += reward;
      } else {
        ws.items.add(reward);
      }
    },
    isAvailable
  );

export const createFailedPickpocketInteraction = (
  entityKey: EntityKey,
  killText = "Stabs you in the chest",
  isAvailable?: InteractionAvailabilityCallback<GameWorldState>
) =>
  createPickpocketInteraction(
    entityKey,
    `What are you trying to do??\n<${killText}>`,
    createKillPlayerCallback(3),
    isAvailable
  );

export const createKillInteraction = (
  response: string = "Argh...",
  action?: InteractionActionCallback<GameWorldState>
): Interaction => ({
  key: "k",
  text: "<Murder>",
  response,
  action,
  isAvailable: (ws: GameWorldState) => ws.items.has(KNIFE.key),
});

export const createKillPlayerCallback =
  (timeInSeconds: number) => (worldState: GameWorldState) =>
    withTimeout(() => {
      worldState.isDead = true;
    }, timeInSeconds);

export const createWinCallback = () => (worldState: GameWorldState) => {
  worldState.items.add(EXIT_KEY.key);
};

export const createBrickSceneRenderComponent = () =>
  new RectRenderComponent("#371415", "topLeft");

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

export const createTable = (pos: Vec2, length = 3) => {
  const middle = new Array(length - 2)
    .fill(0)
    .map((_, i) =>
      createSolidEntity(IMAGES_KEY.tableMiddle, add(pos, [i + 1, 0]))
    );

  const left = createSolidEntity(IMAGES_KEY.tableLeft, pos);
  const right = createSolidEntity(
    IMAGES_KEY.tableLeft,
    add(pos, [length - 1, 0]),
    undefined,
    undefined,
    "l"
  );

  return [left, ...middle, right];
};
