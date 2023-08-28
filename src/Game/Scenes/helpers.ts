import { BaseEntity } from "../../Engine/BaseEntity";
import { PositionComponent } from "../../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../../Engine/Components/RenderComponent";
import { SceneKey, Scene } from "../../Engine/Scene/Scene";
import { CONFIG } from "../../Engine/config";
import { Vec2 } from "../../Engine/types";
import { convertTileVecToGlobal } from "../../Engine/utils";
import { ImageId } from "../../assets";

export const createScenePositionComponent = (
  pos: Vec2 = [1, 1],
  dim: Vec2 = [CONFIG.width - 2, CONFIG.height - 2]
) =>
  new PositionComponent(
    convertTileVecToGlobal(pos),
    convertTileVecToGlobal(dim)
  );

export const createSolidEntity = (pos: Vec2, imageId: ImageId) =>
  new BaseEntity({
    position: new PositionComponent(
      convertTileVecToGlobal(pos),
      convertTileVecToGlobal([1, 1])
    ),
    collision: { type: "solid" },
    // render: new RectRenderComponent("#ff0000"),
    render: new ImageRenderComponent(imageId),
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
  left: SceneKey,
  right: SceneKey
): Scene =>
  new Scene(
    `horizontal-${left}-${right}`,
    new PositionComponent(
      convertTileVecToGlobal([0, CONFIG.height / 2 - 1.5]),
      convertTileVecToGlobal([CONFIG.width, 3])
    ),
    createBrickSceneRenderComponent(),
    {
      l: left,
      r: right,
    }
  );

export const createVerticalTunnel = (top: SceneKey, down: SceneKey): Scene =>
  new Scene(
    `vertical-${top}-${down}`,
    new PositionComponent(
      convertTileVecToGlobal([CONFIG.width / 2 - 1.5, 0]),
      convertTileVecToGlobal([3, CONFIG.height])
    ),
    createBrickSceneRenderComponent(),
    {
      t: top,
      d: down,
    }
  );
