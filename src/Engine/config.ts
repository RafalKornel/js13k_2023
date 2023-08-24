export const CONFIG = {
  width: 16,
  height: 12,
  tileSize: 8,
  scale: 4,
};

export const SCREEN_WIDTH = CONFIG.width * CONFIG.tileSize;
export const SCREEN_HEIGHT = CONFIG.height * CONFIG.tileSize;

export const TEXT_CONFIG = {
  fontSize: 48,
  fontFace: "serif",
  textAlign: "left",
  textBaseline: "top",
  lineHeight: 1,
  marginX: 8,
  offset: [0.5, -0.6],
} as const;

export const IMAGES_MAP = {
  smile: 1,
  pointer: 0,
};
