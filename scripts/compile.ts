import * as fs from "fs";
import * as png from "fast-png";

// @ts-ignore
import { RGBTAoHex, getDirname } from "./utils.ts";
import path from "path";

type Images = { name: string; data: Uint8ClampedArray };

function encodeImages(inputPath: string, outputPath: string) {
  const images: Images[] = [];

  const colorsMap = new Map<string, number>();

  let currentColorIdx = 0;

  const BYTES_PER_COLOR = 4;
  const COLORS_IN_PALETTE = 8;

  const colors = new Uint8ClampedArray(BYTES_PER_COLOR * COLORS_IN_PALETTE);

  try {
    const dir = fs.readdirSync(inputPath);

    for (const name of dir) {
      if (typeof name !== "string") {
        continue;
      }

      if (name.startsWith(".")) {
        continue;
      }

      const imageEncoded = encodeImage(`${inputPath}/${name}`);

      images.push({ name: name.replace(".png", ""), data: imageEncoded });
    }

    generateAssetsFile(colors, images);
  } catch (e) {
    console.error(e);
  }

  function generateAssetsFile(colors: Uint8ClampedArray, images: Images[]) {
    console.log("Compiling images to binary files...");

    images.forEach(({ data, name }) => {
      fs.writeFileSync(outputPath + "/" + name, data, "binary");
    });

    fs.writeFileSync(outputPath + "/colors", colors, "binary");

    console.log("Success!");
  }

  function encodeImage(imagePath: string) {
    const data = fs.readFileSync(imagePath);

    const decoded = png.decode(data);

    const hasTransparency = !decoded.transparency;

    const colorByteSize = hasTransparency ? 4 : 3;

    const arr = new Uint8ClampedArray(decoded.width * decoded.height);

    for (let y = 0; y < decoded.height; y++) {
      for (let x = 0; x < decoded.width; x++) {
        const flatIndex = x + y * decoded.width;
        const i = flatIndex * colorByteSize;

        const r = decoded.data[i + 0];
        const g = decoded.data[i + 1];
        const b = decoded.data[i + 2];
        const a = hasTransparency ? decoded.data[i + 3] : undefined;

        const hex = RGBTAoHex(r, g, b, a);

        if (colorsMap.has(hex)) {
          arr[flatIndex] = colorsMap.get(hex)!;
        } else {
          colorsMap.set(hex, currentColorIdx);

          colors[currentColorIdx * colorByteSize + 0] = r;
          colors[currentColorIdx * colorByteSize + 1] = g;
          colors[currentColorIdx * colorByteSize + 2] = b;

          if (hasTransparency) {
            colors[currentColorIdx * colorByteSize + 3] = a!;
          }

          arr[flatIndex] = currentColorIdx;

          currentColorIdx++;
        }
      }
    }

    return arr;
  }
}

const __dirname = getDirname();

const INPUT_PATH = path.resolve(__dirname + "/../assets/raw/");
const OUTPUT_PATH = path.resolve(__dirname + "/../assets/compiled/");
// const OUTPUT_PATH = path.resolve(__dirname + "/../src/assets.ts");

encodeImages(INPUT_PATH, OUTPUT_PATH);
