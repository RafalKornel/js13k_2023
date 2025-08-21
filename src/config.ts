export const CONFIG = {
  width: 90,
  height: 160,
  tileSize: 4,
  scale: 4,
  g: 50,
};

export const SCREEN_WIDTH = CONFIG.width * CONFIG.tileSize;
export const SCREEN_HEIGHT = CONFIG.height * CONFIG.tileSize;

export const canvas = document.querySelector<HTMLCanvasElement>("#g")!;
export const ctx = canvas.getContext("2d")!;

export const ratio = SCREEN_WIDTH / canvas.clientWidth;

export const width = SCREEN_WIDTH;
export const height = SCREEN_HEIGHT;

canvas.width = width;
canvas.height = height;

ctx.imageSmoothingEnabled = false;

if (!ctx) {
  throw new Error("ctx failed");
}

export const bpc = 4; // bytes per color


// export const TEXT_CONFIG = {
//   fontSize: {
//     m: 2, // vh
//     l: 4, // vh
//   },
//   fontFace: "serif",
//   textAlign: "left",
//   textBaseline: "top",
//   lineHeight: 1.3,
//   margin: 16,
//   offset: [0.5, -0.6],
//   color: "#ffffff",
//   borderColor: "#ffffff",
//   borderBackground: "#000000bf",
// } as const;
