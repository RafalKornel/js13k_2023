import { InputManager } from "./InputManager.ts";
import { PortalCollisionEvent, observer } from "./Observer.ts";
import { Renderer } from "./Renderer.ts";
import { Scene, SceneKey } from "./Scene.ts";

export class SceneManager {
  private _currentScene: Scene;

  readonly scenes: Map<SceneKey, Scene>;

  constructor(initialScene: Scene) {
    this.scenes = new Map();

    this._currentScene = initialScene;

    observer.registerCallback("portal-collision", (e) => {
      const portalEvent = e as PortalCollisionEvent;

      const portal = portalEvent.data.portal;

      const sceneKey = Scene.portalSceneMap.get(portal.key);

      this.changeScene(sceneKey!);
    });
  }

  get scene(): Scene {
    return this._currentScene;
  }

  render(renderer: Renderer) {
    this._currentScene.render(renderer);
  }

  registerScene(scene: Scene) {
    this.scenes.set(scene.sceneKey, scene);
  }

  update(inputManager: InputManager): void {
    const kp = inputManager.keysPressed;

    if (kp.has("l") || kp.has("j")) {
      this.changeScene("horizontalTunnel");
    }

    if (kp.has("i") || kp.has("k")) {
      this.changeScene("verticalTunnel");
    }

    if (kp.has("r")) {
      this.changeScene("initial");
    }

    this.scene.children.forEach((child) => {
      child.update(inputManager);
    });
  }

  changeScene(key: SceneKey) {
    this._currentScene = this.scenes.get(key)!;
  }
}
