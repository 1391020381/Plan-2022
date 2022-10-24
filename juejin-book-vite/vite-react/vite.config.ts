import { defineConfig, normalizePath } from "vite";
// 如果类型报错, 需要安装 @types/node  pnpm i @types/node -D
import path from "path";
import react from "@vitejs/plugin-react";
import winddi from "vite-plugin-windicss";
// 全局 scss文件的路径
// 用 normalizePath 解决 window下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));
// https://vitejs.dev/config/
export default defineConfig({
  // css 相关配置
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      generateScopedName: "[name]_[local]__[hash:base64:5]",
    },
    preprocessorOptions: {
      scss: {
        // 注意 `@import "${variablePath}";` 格式 标点
        additionalData: `@import "${variablePath}";`,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          // // 适配 styled-component
          // "babel-plugin-styled-components",
          // // 适配 emotion
          // "@emotion/babel-plugin",
        ],
      },
      // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
      // jsxRuntime: "automatic", // <---
      // jsxImportSource: "@emotion/react",
    }),
    winddi(),
  ],
});
