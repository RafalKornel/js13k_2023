import { CollisionManager } from "./CollisionManager";
import { InputManager } from "./InputManager";
import { SceneManager } from "./Scene/SceneManager";
import { BaseWorldState, WorldState } from "./types";

interface IGameState {
  inputManager: InputManager;
  sceneManager: SceneManager;
  collisionManager: CollisionManager;
  worldState: WorldState;
}

export class GameState<TWorldState extends WorldState = BaseWorldState>
  implements IGameState
{
  constructor(
    readonly inputManager: InputManager,
    readonly sceneManager: SceneManager,
    readonly collisionManager: CollisionManager,
    readonly worldState: TWorldState
  ) {}
}
