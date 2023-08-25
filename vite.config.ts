import fs, { statSync } from "fs";
import { defineConfig, Plugin } from "vite";
import advzip from "advzip-bin";
import { execFileSync, execSync } from "child_process";

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

function compressPlugin(): Plugin {
  return {
    name: "vite:compress",
    writeBundle: async () => {
      const args = ["-r", "dist.zip", "dist/"];

      execSync("rm dist.zip");

      execSync(`zip ${args.reduce((p, n) => p + " " + n, "")}`);
    },
  };
}

/**
 * Creates the advzip plugin that uses AdvanceCOMP to optimize the zip file.
 * @returns The advzip plugin.
 */
function advzipPlugin() {
  return {
    name: "vite:advzip",
    writeBundle: async (): Promise<void> => {
      try {
        const args = ["--recompress", "--shrink-extra", "dist.zip"];
        const result = execFileSync(advzip, args);
        console.log(result.toString().trim());
        const stats = statSync("dist.zip");
        console.log("advzip ZIP size", stats.size);
      } catch (err) {
        console.log("advzip error", err);
      }
    },
  };
}

export default defineConfig({
  plugins: [binaryLoaderPlugin(), compressPlugin(), advzipPlugin()],
});
