import { Base64 } from "./types";

interface ICustomImageDecoder {
  colorsBuffer: Uint8ClampedArray;

  decodeImg(
    img: Base64,
    width: number,
    height: number,
    bytesPerColor: 3 | 4
  ): Uint8ClampedArray;
}

export class CustomImageDecoder implements ICustomImageDecoder {
  colorsBuffer: Uint8ClampedArray;

  constructor(readonly colors: Base64) {
    this.colorsBuffer = this.decodeBase64(colors);
  }

  decodeImg(img: Base64, width: number, height: number, bytesPerColor: 3 | 4) {
    const compressedImgBuffer = this.decodeBase64(img);

    const imgBuffer = new Uint8ClampedArray(width * height * bytesPerColor);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = x + y * width;

        console.log(i);

        const colorIdx = compressedImgBuffer[i];

        console.log(colorIdx);

        const r = this.colorsBuffer[colorIdx * bytesPerColor + 0];
        const g = this.colorsBuffer[colorIdx * bytesPerColor + 1];
        const b = this.colorsBuffer[colorIdx * bytesPerColor + 2];
        const a = bytesPerColor
          ? this.colorsBuffer[colorIdx * bytesPerColor + 3]
          : undefined;

        console.log(r, g, b, a);

        imgBuffer[i * bytesPerColor + 0] = r;
        imgBuffer[i * bytesPerColor + 1] = g;
        imgBuffer[i * bytesPerColor + 2] = b;

        if (a !== undefined) {
          imgBuffer[i * bytesPerColor + 3] = a;
        }
      }
    }

    return imgBuffer;
  }

  private decodeBase64(data: Base64): Uint8ClampedArray {
    const raw = atob(data);

    const array = new Uint8ClampedArray(new ArrayBuffer(raw.length));

    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  }
}
