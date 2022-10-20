//  main application server

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import express from "express";
// eslint-disable-next-line
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export async function createServer(
  // eslint-disable-next-line
  root = process.cwd(),
  // eslint-disable-next-line
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resolve = (p) => path.resolve(__dirname, p);

  // template  模板
  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/index.html"), "utf-8")
    : "";

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    // 以中间件模式创建 Vite 应用 这将禁用 Vite 自身的 HTML服务逻辑
    // 并让上级服务器接管控制
    vite = await (
      await import("vite")
    ).createServer({
      base: "/test/",
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    // 使用 vite 的Connect 实例作为中间件
    app.use(vite.middlewares);
  } else {
    app.use(
      (await import("serve-static")).default(resolve("dist"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    // 供给服务端渲染的HTML
    try {
      const url = req.originalUrl.replace("/test/", "/");

      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        // 应用 Vite HTML 转换 这将会注入 Vite HMR 客服端
        // 同时也会 从 Vite 插件应用 HTML转换
        template = await vite.transformIndexHtml(url, template);
        //  加载服务器入口 vite.ssrLoadModule 将自动转换
        //
        render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
      } else {
        template = indexProd;
        // @ts-ignore
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const [appHtml] = await render(url);

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(6173, () => {
      console.log("http://localhost:6173");
    })
  );
}

// package.json  dev:"node server"

// 为了生产环境构建
// 正常生成一个客户端构建
// 再生成一个SSR构建,使其通过 import() 直接加载,这样便无需再使用Vite的 ssrLoadModule

// --ssr 标志标明这将会是一个 SSR构建。同时需要指定SSR的入口
// {
//   "scripts": {
//     "dev": "node server",
//     "build:client": "vite build --outDir dist/client",
//     "build:server": "vite build --outDir dist/server --ssr src/entry-server.js "
//   }
// }
