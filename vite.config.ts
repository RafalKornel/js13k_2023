import fs from "fs";
import { defineConfig, Plugin } from "vite";

import { viteSingleFile } from "vite-plugin-singlefile";
import { createHtmlPlugin } from "vite-plugin-html";
import { Packer, InputType, InputAction } from "roadroller";
import path from "path";

function binaryDirectoryLoaderPlugin(): Plugin {
  return {
    name: "binary-directory-loader",
    transform(code, id) {
      const [file, query] = id.split("?");

      if (query !== "binary-directory") {
        return null;
      } // Change query string to match your use case

      if (!file.endsWith("colors")) {
        return null;
      }

      const colorsData = fs.readFileSync(file);

      const colors = new Uint8ClampedArray(colorsData);

      const directory = path.resolve(file + "/../");

      const assets: Array<[string, Uint8ClampedArray]> = [];

      try {
        const files = fs.readdirSync(directory);

        for (const currFile of files) {
          const filepath = path.join(directory, currFile);

          if (file === filepath) {
            continue;
          }

          const data = fs.readFileSync(filepath);

          assets.push([currFile, new Uint8ClampedArray(data)]);
        }
      } catch (e) {
        console.error(`failed importing "${id}"`);
      }

      const codeToReturn = `
          const colors = new Uint8ClampedArray([${colors}]);

          const assets = 
          [${assets.map(
            ([key, data]) => `[ new Uint8ClampedArray([${data}]), [${key.split("_")[2].split("x")}] ]`
          )}];

          export default { assets, colors };
      `;

      console.log(codeToReturn);

      return { code: codeToReturn, map: null };
    },
  };
}

function roadrollerPlugin(): Plugin {
  return {
    name: "roadroller",
    async transformIndexHtml(html, context) {
      if (!context || !context.bundle) return html;

      let transformedScripts: string[] = [];

      for (const asset of Object.values(context.bundle)) {
        if (asset.type !== "chunk") continue;

        const packer = new Packer(
          [
            {
              data: asset.code,
              type: "js" as InputType.JS,
              action: "eval" as InputAction.Eval,
            },
          ],
          {}
        );

        await packer.optimize(3);

        const { firstLine, secondLine } = packer.makeDecoder();

        transformedScripts.push(`<script>${firstLine}${secondLine}</script>`);
      }

      // html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");

      return html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
        .replace(/<\/body>/, `${transformedScripts.join("")}</body>`);
    },
  };
}

export default defineConfig({
  base: "/js13k_2025/",
  plugins: [
    // roadrollerPlugin(),
    viteSingleFile({ deleteInlinedFiles: true, removeViteModuleLoader: true }),
    createHtmlPlugin({
      minify: true,
    }),
    binaryDirectoryLoaderPlugin(),
  ],
  build: {
    target: "esnext",
    minify: "terser",
    modulePreload: {
      polyfill: false,
    },
    cssCodeSplit: false,
    // brotliSize: false,
    terserOptions: {
      compress: {
        ecma: 2020,
        passes: 2,
        drop_console: true,
        dead_code: true,
        reduce_vars: true,
      },
      mangle: {
        toplevel: true,
        module: true,
        properties: true, // disable unless you know what you’re mangling
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      toplevel: true,
      module: true,
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
