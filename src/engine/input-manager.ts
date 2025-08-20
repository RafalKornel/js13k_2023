export type InputKey = string;

export class InputManager {
  private _keysPressed: Set<InputKey>;

  constructor() {
    this._keysPressed = new Set<InputKey>();

    window.addEventListener("keydown", (e) => {
      this._keysPressed.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this._keysPressed.delete(e.key);
    });
  }

  get keysPressed() {
    return new Set(this._keysPressed);
  }
}
