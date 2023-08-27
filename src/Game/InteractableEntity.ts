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
import { IMAGES_KEY } from "../assets";

const colors: Record<ComponentState, string> = {
  active: "#FFC436",
  available: "#337CCF",
  idle: "#1450A3",
};

export class TestInteractableEntity extends BaseEntity {
  constructor(pos: Vec2, key: string) {
    super(
      {
        position: new PositionComponent(
          convertTileVecToGlobal(pos),
          convertTileVecToGlobal([1, 1])
        ),
        render: new ImageRenderComponent(IMAGES_KEY.smile),
        collision: { type: "interactable" },
        interaction: new TestInteractionComponent(),
      },
      key
    );
  }

  render(renderer: Renderer): void {
    super.render(renderer);

    if (this.components.interaction!.state === "available") {
      const p = this.components.position.pos;
      renderer.drawText(
        `${this.key} (e)`,
        "l",
        ...add(p, convertTileVecToGlobal([0, -1] as Vec2))
      );

      // TODO: implement dialogue system
    } else if (this.components.interaction!.state === "active") {
      renderer.dialogueModal(
        this.key,
        "Hello brave advenruter!\nWhat can I do for you?",
        [
          { key: "1", text: "Give me a beer!" },
          { key: "2", text: "Do you know anything about john?" },
          { key: "e", text: "<pickpocket>" },
          { key: "q", text: "<kill>" },
        ]
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

    if (ic.state === "available" && kp.has("e")) {
      ic.startInteraction();
    }

    if (ic.state === "active" && kp.has("x")) {
      ic.endInteraction();
    }

    const r = this.components.render as RectRenderComponent;

    r.color = colors[ic.state];
  }
}
