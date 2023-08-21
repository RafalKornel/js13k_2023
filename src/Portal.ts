import { BaseEntity } from "./Engine/BaseEntity";
import { SceneKey } from "./Engine/Scene";

export class Portal extends BaseEntity {
  public linkedPortal?: Portal;
  public sceneKey?: SceneKey;
}
