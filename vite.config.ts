import fs from "fs";
import { defineConfig, Plugin } from "vite";

function binaryLoaderPlugin(): Plugin {
  return {
    name: "binary-loader",
    transform(code, id) {
      const [path, query] = id.split("?");
      if (query !== "binary") return null; // Change query string to match your use case

      const data = fs.readFileSync(path);
      const uintArray = new Uint8ClampedArray(data);

      const codeToReturn = `
      const array = new Uint8ClampedArray([${uintArray.join(",")}]);
      export default array;
    `;

      return {
        code: codeToReturn,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [binaryLoaderPlugin()],
});
