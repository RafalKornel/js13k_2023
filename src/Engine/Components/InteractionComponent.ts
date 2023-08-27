export type ComponentState = "idle" | "available" | "active";

export interface IInteractionComponent {
  state: ComponentState;

  startInteraction(): void;
  endInteraction(): void;

  setAvailability(isAvailable: boolean): void;
}

export class TestInteractionComponent implements IInteractionComponent {
  state: ComponentState = "idle";

  startInteraction(): void {
    this.state = "active";
  }

  endInteraction(): void {
    this.state = "idle";
  }

  setAvailability(isAvailable: boolean) {
    if (isAvailable && this.state === "idle") {
      this.state = "available";
    } else if (!isAvailable && this.state === "available") {
      this.state = "idle";
    }
  }
}
