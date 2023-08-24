import { BaseEntity } from "../Engine/BaseEntity";
import {
  ComponentState,
  IInteractionComponent,
  TestInteractionComponent,
} from "../Engine/Components/InteractionComponent";
import { PositionComponent } from "../Engine/Components/PositionComponent";
import {
  ImageRenderComponent,
  RectRenderComponent,
} from "../Engine/Components/RenderComponent";
import { Renderer } from "../Engine/Renderer";
import { GameState } from "../Engine/GameState";
import { Vec2 } from "../Engine/types";
import { add, convertTileVecToGlobal, getEntityPairKey } from "../Engine/utils";
import { PLAYER_INTERACTION_COLLIDER_KEY } from "../Engine/Player/PlayerInteractionCollider";
import { IMAGES_MAP } from "../Engine/config";

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
      render: new ImageRenderComponent(IMAGES_MAP.smile),
      collision: { type: "interactable" },
      interaction: new TestInteractionComponent(),
    });
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    if (this.components.interaction!.state === "available") {
      const p = this.components.position.pos;

      // TODO: implement dialogue system

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

  update(state: GameState) {
    const ic: IInteractionComponent = this.components.interaction!;
    const kp: Set<string> = state.inputManager.keysPressed;

    if (
      !state.collisionManager.collisions.has(
        getEntityPairKey(this.key, PLAYER_INTERACTION_COLLIDER_KEY)
      ) &&
      ic.state === "active"
    ) {
      ic.endInteraction();
    }

    if ((ic.state === "available" && kp.has("1")) || kp.has("2")) {
      ic.startInteraction();
    }

    if (ic.state === "active" && kp.has("x")) {
      ic.endInteraction();
    }

    const r = this.components.render as RectRenderComponent;

    r.color = colors[ic.state];
  }
}
