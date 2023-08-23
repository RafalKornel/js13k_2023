import { CollisionManager } from "./CollisionManager";
import { InputManager } from "./InputManager";
import { SceneManager } from "./Scene/SceneManager";

interface IGameState {
  inputManager: InputManager;
  sceneManager: SceneManager;
  collisionManager: CollisionManager;
  // decisions tree?
}

export class GameState implements IGameState {
  constructor(
    readonly inputManager: InputManager,
    readonly sceneManager: SceneManager,
    readonly collisionManager: CollisionManager
  ) {}
}
