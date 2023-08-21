import { InputKey } from "./InputKey.ts";
import { Chamber, CHAMBERS, ChamberKey } from "./Chamber.ts";
import { Game } from "./Game.ts";

export class SceneManager {
  private _currentChamber: Chamber;

  constructor(private readonly game: Game) {
    this._currentChamber = new Chamber(CHAMBERS.initial);
  }

  render(ctx: CanvasRenderingContext2D) {
    this._currentChamber.render(ctx);
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

  changeChamber(key: ChamberKey) {
    this._currentChamber = new Chamber(CHAMBERS[key]);
  }

  get chamber() {
    return this._currentChamber;
  }
}
