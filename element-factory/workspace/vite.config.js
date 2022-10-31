import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import vue from "@vitejs/plugin-vue";
import compile from "../src/index.mjs";

function plugin() {
  return {
    name: "transform-tpl",
    transform(src, id) {
      if (/\.tpl$/.test(id)) {
        const code = compile(src, {});
        return { code };
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), plugin()],
  build: {
    rollupOptions: {
      // 有时候一些外部引用的库我们并不想一并打包到我们的库中,如 lodash react 可以在 配置文件中使用 external字段来告诉rollup不要将这些库打包
      external: ["vue"],
      output: {
        globals: {
          //
          vue: "Vue",
        },
      },
    },
    lib: {
      entry: "./app.tpl",
      name: "MyLib",
      // the proper extensions will be added
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "amd", "umd"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
