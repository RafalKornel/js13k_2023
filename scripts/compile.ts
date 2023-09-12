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
  const COLORS_IN_PALETTE = 128;

  const colors = new Uint8ClampedArray(BYTES_PER_COLOR * COLORS_IN_PALETTE);

  try {
    fs.rmSync(outputPath, { recursive: true, force: true });

    fs.mkdirSync(outputPath);

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
      fs.writeFileSync(outputPath + "/" + name, data, {
        encoding: "binary",
        flag: "wx",
      });
    });

    const slicedColors = colors.slice(0, COLORS_IN_PALETTE * colorsMap.size);

    fs.writeFileSync(outputPath + "/colors", slicedColors, "binary");

    console.log("Success!");
  }

  function encodeImage(imagePath: string) {
    const data = fs.readFileSync(imagePath);

    const decoded = png.decode(data);

    const colorByteSize = decoded.channels;

    const hasTransparency = colorByteSize === 4;

    const arr = new Uint8ClampedArray(decoded.width * decoded.height);

    for (let y = 0; y < decoded.height; y++) {
      for (let x = 0; x < decoded.width; x++) {
        const flatIndex = x + y * decoded.width;
        const i = flatIndex * colorByteSize;

        const r = decoded.data[i + 0];
        const g = decoded.data[i + 1];
        const b = decoded.data[i + 2];
        const a = hasTransparency ? decoded.data[i + 3] : 255;

        const hex = RGBTAoHex(r, g, b, a);

        if (colorsMap.has(hex)) {
          arr[flatIndex] = colorsMap.get(hex)!;
        } else {
          colorsMap.set(hex, currentColorIdx);

          colors[currentColorIdx * BYTES_PER_COLOR + 0] = r;
          colors[currentColorIdx * BYTES_PER_COLOR + 1] = g;
          colors[currentColorIdx * BYTES_PER_COLOR + 2] = b;
          colors[currentColorIdx * BYTES_PER_COLOR + 3] = a;

          arr[flatIndex] = currentColorIdx;

          currentColorIdx++;

          if (currentColorIdx === COLORS_IN_PALETTE) {
            throw new Error(`Too many colors! Colors map: ${colorsMap}`);
          }
        }
      }
    }

    return arr;
  }

  console.log(`Size of color map: ${colorsMap.size}`);
}

const __dirname = getDirname();

const INPUT_PATH = path.resolve(__dirname + "/../assets/raw/");
const OUTPUT_PATH = path.resolve(__dirname + "/../assets/compiled/");

encodeImages(INPUT_PATH, OUTPUT_PATH);
