export const getWorldState = () => ({
  isDead: false,
});

export type GameWorldState = ReturnType<typeof getWorldState>;
