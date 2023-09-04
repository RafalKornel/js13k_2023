import { Direction, Vec2 } from "../types";
import { Assets, Colors, ImageCacheKey } from "./types";
import { flipImage, rotate90Deg } from "../utils";
import { getImageCacheKey } from "./utils";

const SUPPORTED_DIRECTIONS: Direction[] = ["l", "r", "d"];

type ImageData = [data: Uint8ClampedArray, dim: Vec2];

interface ICustomImageDecoder {
  colorsBuffer: Uint8ClampedArray;

  getImageData(imageId: number, dir: Direction): ImageData;
}

export class CustomImageDecoder implements ICustomImageDecoder {
  private _imagesCache: Map<ImageCacheKey, ImageData>;

  colorsBuffer: Uint8ClampedArray;

  constructor(
    readonly colors: Colors,
    readonly assets: Assets,
    readonly bytesPerColor = 4
  ) {
    this.colorsBuffer = colors;

    this._imagesCache = new Map();

    Object.entries(assets).forEach(([id]) => {
      this.decompressImageWithVariants(Number(id));
    });
  }

  public getImageData(imageId: number, dir: Direction): ImageData {
    const image = this._imagesCache.get(getImageCacheKey(imageId, dir));

    if (!image) throw new Error("Img not found");

    return image;
  }

  decompressImageWithVariants(imageId: number) {
    const imageData = this.assets[imageId];

    const { data, s } = imageData;

    for (const dir of SUPPORTED_DIRECTIONS) {
      const cacheKey = getImageCacheKey(imageId, dir);

      this.decompress(cacheKey, data, s);
    }

    this.decompress(getImageCacheKey(imageId, "r"), data, s);
    this.decompress(getImageCacheKey(imageId, "l"), flipImage(data, s[0]), s);
    this.decompress(getImageCacheKey(imageId, "t"), rotate90Deg(data, s[0]), s);
    this.decompress(
      getImageCacheKey(imageId, "d"),
      flipImage(rotate90Deg(data, s[0]), s[0]),
      s
    );
  }

  decompress(key: ImageCacheKey, data: Uint8ClampedArray, size: Vec2) {
    const [width, height] = size;

    const imgBuffer = new Uint8ClampedArray(
      width * height * this.bytesPerColor
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = x + y * width;

        const colorIdx = data[i];

        const r = this.colorsBuffer[colorIdx * this.bytesPerColor + 0];
        const g = this.colorsBuffer[colorIdx * this.bytesPerColor + 1];
        const b = this.colorsBuffer[colorIdx * this.bytesPerColor + 2];
        const a = this.bytesPerColor
          ? this.colorsBuffer[colorIdx * this.bytesPerColor + 3]
          : undefined;

        imgBuffer[i * this.bytesPerColor + 0] = r;
        imgBuffer[i * this.bytesPerColor + 1] = g;
        imgBuffer[i * this.bytesPerColor + 2] = b;

        if (a !== undefined) {
          imgBuffer[i * this.bytesPerColor + 3] = a;
        }
      }
    }

    this._imagesCache.set(key, [imgBuffer, size]);
  }
}
