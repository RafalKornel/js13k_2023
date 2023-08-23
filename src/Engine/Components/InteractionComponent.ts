export type ComponentState = "idle" | "available" | "active";
type InteractionType = "dialogue" | "test";

export interface IInteractionComponent {
  state: ComponentState;
  type: InteractionType;

  startInteraction(): void;
  endInteraction(): void;

  setAvailability(isAvailable: boolean): void;
}

export class TestInteractionComponent implements IInteractionComponent {
  state: ComponentState = "idle";
  type: InteractionType = "test";

  startInteraction(): void {
    this.state = "active";

    console.log("hello!");
  }

  endInteraction(): void {
    this.state = "idle";

    console.log("bye!");
  }

  setAvailability(isAvailable: boolean) {
    if (isAvailable && this.state === "idle") {
      this.state = "available";
    } else if (!isAvailable && this.state === "available") {
      this.state = "idle";
    }
  }
}
