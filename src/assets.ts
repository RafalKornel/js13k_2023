// @ts-ignore
import colorsData from "../assets/compiled/colors?binary";

// @ts-ignore
import smile from "../assets/compiled/smile?binary";
// @ts-ignore
import pointer from "../assets/compiled/pointer?binary";

const IMAGES_KEY = {
  pointer: 0,
  smile: 1,
} as const;

type ImageKey = keyof typeof IMAGES_KEY;

type ImageId = (typeof IMAGES_KEY)[ImageKey];

const IMAGES_MAP: Record<(typeof IMAGES_KEY)[ImageKey], Uint8ClampedArray> = {
  [IMAGES_KEY.pointer]: pointer,
  [IMAGES_KEY.smile]: smile,
};

const colors = colorsData as Uint8ClampedArray;

[...Object.values(IMAGES_MAP), colors].forEach((asset) => {
  if (!(asset instanceof Uint8ClampedArray)) {
    throw new Error(`Invalid asset! ${asset}`);
  }
});

export { IMAGES_KEY, IMAGES_MAP, colors, type ImageKey, type ImageId };
