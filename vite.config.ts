import fs from "fs";
import { defineConfig, Plugin } from "vite";

import { viteSingleFile } from "vite-plugin-singlefile";
import { createHtmlPlugin } from "vite-plugin-html";
import dynamicImport from "vite-plugin-dynamic-import";
import { Packer, InputType, InputAction } from "roadroller";

function binaryLoaderPlugin(): Plugin {
  return {
    name: "binary-loader",
    transform(code, id) {
      const parts = id.split(".");

      const l = parts.length;

      if (l < 2) {
        return null;
      }

      if (parts[l - 1] !== "bin") {
        return null;
      }

      const path = parts.join(".");

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

function base64LoaderPlugin(): Plugin {
  return {
    name: "base64-loader",
    transform(code, id) {
      const [path, query] = id.split("?");
      if (query !== "base64") return null; // Change query string to match your use case

      const data = fs.readFileSync(path);
      const dataEncoded = data.toString("base64");
      // const uintArray = new Uint8ClampedArray(data);

      // console.log(data)

      const codeToReturn = `
      const data = \`${dataEncoded}\`;
      export default data;
    `;

      return {
        code: codeToReturn,
        map: null,
      };
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

        html = html.replace(
          new RegExp(
            `<script type="module"[^>]*?src="/${asset.fileName}"[^>]*?></script>`
          ),
          ""
        );

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

        await packer.optimize(4);

        const { firstLine, secondLine } = packer.makeDecoder();

        transformedScripts.push(`<script>${firstLine}${secondLine}</script>`);
      }

      return html.replace(/<\/body>/, `${transformedScripts.join("")}</body>`);
    },
  };
}

export default defineConfig({
  base: "/js13k_2025/",
  plugins: [
    // roadrollerPlugin(),
    createHtmlPlugin({
      minify: true,
    }),
    viteSingleFile({ deleteInlinedFiles: true, removeViteModuleLoader: true }),
    binaryLoaderPlugin(),
    base64LoaderPlugin(),
    dynamicImport({}),
  ],

  build: {
    target: "esnext",
    minify: "terser",
    polyfillModulePreload: false, // Don't add vite polyfills
    cssCodeSplit: false,
    // brotliSize: false,
    terserOptions: {
      compress: {
        ecma: 2020,
        module: true,
        passes: 3,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
      },
      mangle: {
        module: true,
        toplevel: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      module: true,
      toplevel: true,
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
