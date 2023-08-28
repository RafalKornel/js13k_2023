import { Renderer } from "../Renderer.ts";
import { GameState } from "../GameState.ts";
import { Scene, SceneKey } from "./Scene.ts";

export class SceneManager {
  private _currentScene: Scene;

  readonly scenes: Map<SceneKey, Scene>;

  constructor(scenes: Scene[]) {
    this.scenes = new Map();

    this._currentScene = scenes[0];

    scenes.forEach((scene) => {
      this.registerScene(scene);
    });
  }

  get scene(): Scene {
    return this._currentScene;
  }

  render(renderer: Renderer) {
    this._currentScene.render(renderer);
  }

  private registerScene(scene: Scene) {
    this.scenes.set(scene.sceneKey, scene);
  }

  update(state: GameState): void {
    this.scene.update?.(state);

    this.scene.children.forEach((child) => {
      child.update(state);
    });
  }

  changeScene(key: SceneKey) {
    this._currentScene = this.scenes.get(key)!;
  }
}
