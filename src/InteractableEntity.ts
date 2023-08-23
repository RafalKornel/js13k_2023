import { BaseEntity } from "./Engine/BaseEntity";
import {
  ComponentState,
  IInteractionComponent,
  TestInteractionComponent,
} from "./Engine/Components/InteractionComponent";
import { PositionComponent } from "./Engine/Components/PositionComponent";
import { RectRenderComponent } from "./Engine/Components/RenderComponent";
import { InputManager } from "./Engine/InputManager";
import { Renderer } from "./Engine/Renderer";
import { Vec2 } from "./Engine/types";
import { add, convertTileVecToGlobal } from "./Engine/utils";

const colors: Record<ComponentState, string> = {
  active: "#FFC436",
  available: "#337CCF",
  idle: "#1450A3",
};

export class TestInteractableEntity extends BaseEntity {
  constructor() {
    super({
      position: new PositionComponent(
        convertTileVecToGlobal([4, 4]),
        convertTileVecToGlobal([1, 1])
      ),
      render: new RectRenderComponent("#0000f0"),
      collision: { type: "interactable" },
      interaction: new TestInteractionComponent(),
    });
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    if (this.components.interaction!.state === "available") {
      const p = this.components.position.pos;

      renderer.drawText(
        "1) Greeting traveler! Mind a beer?",
        ...add(p, convertTileVecToGlobal([1, 0] as Vec2))
      );

      renderer.drawText(
        "2) <steal>",
        ...add(p, convertTileVecToGlobal([1, 1] as Vec2))
      );
    } else if (this.components.interaction!.state === "active") {
      const p = this.components.position.pos;

      renderer.drawText(
        "dsadasdasda",
        ...add(p, convertTileVecToGlobal([1, 0] as Vec2))
      );
    }
  }

  update(inputManager: InputManager) {
    const ic: IInteractionComponent = this.components.interaction!;

    if (
      (ic.state === "available" && inputManager.keysPressed.has("1")) ||
      inputManager.keysPressed.has("2")
    ) {
      ic.startInteraction();
    }

    if (ic.state === "active" && inputManager.keysPressed.has("x")) {
      ic.endInteraction();
    }

    const r = this.components.render as RectRenderComponent;

    r.color = colors[ic.state];
  }
}
