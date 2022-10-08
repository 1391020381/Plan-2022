# index.html 与 项目根目录
* [index.html与项目根目录](https://cn.vitejs.dev/guide/#index-html-and-project-root)
* index.html 在项目最外层而不是在 public文件夹内。
* 这是有意为之的,在开发期间Vite是一个服务器,而Index.html是该Vite项目的入口文件。
* Vite 将 index.html 视为源码和模块图的一部分。Vite 解析 <script type="module" src="..."> ，这个标签指向你的 JavaScript 源码。甚至内联引入 JavaScript 的 <script type="module"> 和引用 CSS 的 <link href> 也能利用 Vite 特有的功能被解析。另外，index.html 中的 URL 将被自动转换，因此不再需要 %PUBLIC_URL% 占位符了。

# 构建生产版本
* [构建生产版本](https://cn.vitejs.dev/guide/build.html#building-for-production)
* 当需要将应用部署到生产环境时，只需运行 vite build 命令。默认情况下，它使用 <root>/index.html 作为其构建入口点，并生成能够静态部署的应用程序包。请查阅 部署静态站点 获取常见服务的部署指引。
# 服务端渲染
* [服务端渲染](https://cn.vitejs.dev/guide/ssr.html)