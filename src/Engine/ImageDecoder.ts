interface ICustomImageDecoder {
  colorsBuffer: Uint8ClampedArray;

  decompressImage(
    compressedImgBuffer: Uint8ClampedArray,
    width: number,
    height: number,
    bytesPerColor: 3 | 4
  ): Uint8ClampedArray;
}

export class CustomImageDecoder implements ICustomImageDecoder {
  colorsBuffer: Uint8ClampedArray;

  constructor(readonly colors: Uint8ClampedArray) {
    this.colorsBuffer = colors;
  }

  decompressImage(
    compressedImgBuffer: Uint8ClampedArray,
    width: number,
    height: number,
    bytesPerColor: 3 | 4
  ) {
    const imgBuffer = new Uint8ClampedArray(width * height * bytesPerColor);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = x + y * width;

        const colorIdx = compressedImgBuffer[i];

        // console.log(coorIdx);

        const r = this.colorsBuffer[colorIdx * bytesPerColor + 0];
        const g = this.colorsBuffer[colorIdx * bytesPerColor + 1];
        const b = this.colorsBuffer[colorIdx * bytesPerColor + 2];
        const a = bytesPerColor
          ? this.colorsBuffer[colorIdx * bytesPerColor + 3]
          : undefined;

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
}
