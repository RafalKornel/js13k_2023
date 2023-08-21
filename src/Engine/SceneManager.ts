import { Portal } from "../Portal.ts";
import { InputKey } from "./InputKey.ts";
import { PortalCollisionEvent, observer } from "./Observer.ts";
import { Renderer } from "./Renderer.ts";
import { Scene, SceneKey } from "./Scene.ts";

export class SceneManager {
  private _currentScene: Scene;

  constructor(private _scenes: Map<SceneKey, Scene>, initialScene: SceneKey) {
    this._currentScene = _scenes.get(initialScene)!;

    observer.registerCallback("portal-collision", (e) => {
      const portalEvent = e as PortalCollisionEvent;

      const portal = portalEvent.data.portal as Portal;

      console.log(portal);

      this.changeChamber(portal.linkedPortal!.sceneKey!);
    });
  }

  get scene(): Scene {
    return this._currentScene;
  }

  render(renderer: Renderer) {
    this._currentScene.render(renderer);
  }

  update(keysPressed: Set<InputKey>): void {
    if (keysPressed.has("l") || keysPressed.has("j")) {
      this.changeChamber("horizontalTunnel");
    }

    if (keysPressed.has("i") || keysPressed.has("k")) {
      this.changeChamber("verticalTunnel");
    }

    if (keysPressed.has("r")) {
      this.changeChamber("initial");
    }
  }

  changeChamber(key: SceneKey) {
    this._currentScene = this._scenes.get(key)!;
  }
}
