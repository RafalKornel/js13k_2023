import { BaseEntity, EntityKey } from "./Engine/BaseEntity";
import { PortalCollisionEvent, observer } from "./Engine/Observer";
import { Rect } from "./Engine/Rect";
import { SceneKey, Scene } from "./Engine/Scene";
import { CONFIG } from "./Engine/config";
import { Portal } from "./Portal";

function onCollide(thisEntity: BaseEntity, _otherEntity: BaseEntity) {
  observer.emitEvent({
    name: "portal-collision",
    data: { portal: thisEntity },
  });
}

const initialScene = new Scene("initial", [1, 1], "#9e3333");

const tunnelScene = new Scene("tunnel", [1, 0.2], "#9e3333");

const portalA = new Portal(
  [10 * CONFIG.tileSize, 5 * CONFIG.tileSize],
  [CONFIG.tileSize, CONFIG.tileSize],
  "#0000ff",
  {
    type: "solid",
    onCollide,
  }
);

const portalB = new Portal(
  [(CONFIG.width / 2) * CONFIG.tileSize, CONFIG.tileSize / 2],
  [CONFIG.tileSize, CONFIG.tileSize],
  "#0000ff",
  { type: "solid", onCollide }
);

portalA.linkedPortal = portalB;
portalA.sceneKey = "initial";

portalB.linkedPortal = portalA;
portalB.sceneKey = "tunnel";

initialScene.addChild(portalA);

initialScene.addChild(
  new Rect(
    [5 * CONFIG.tileSize, 3 * CONFIG.tileSize],
    [CONFIG.tileSize, CONFIG.tileSize],
    "#00ff00",
    { type: "solid" }
  )
);

tunnelScene.addChild(portalB);

export const scenes = new Map<SceneKey, Scene>();

scenes.set("initial", initialScene);
scenes.set("tunnel", tunnelScene);
