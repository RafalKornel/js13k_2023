type InteractionType = "dialogue";

export interface IInteractionComponent {
  type: InteractionType;

  performInteraction(): void;
}
