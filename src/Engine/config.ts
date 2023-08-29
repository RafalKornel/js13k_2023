export const CONFIG = {
  width: 16,
  height: 12,
  tileSize: 8,
  scale: 4,
};

export const SCREEN_WIDTH = CONFIG.width * CONFIG.tileSize;
export const SCREEN_HEIGHT = CONFIG.height * CONFIG.tileSize;

export const TEXT_CONFIG = {
  fontSize: {
    m: 18,
    l: 36,
  },
  fontFace: "serif",
  textAlign: "left",
  textBaseline: "top",
  lineHeight: 1.3,
  margin: 16,
  offset: [0.5, -0.6],
  color: "#ffffff",
  borderColor: "#ffffff",
  borderBackground: "#000000bf",
} as const;
