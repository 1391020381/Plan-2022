- [juejin-book-vite](https://github.com/1391020381/juejin-book-vite)

# CSS

- 导入 .css 文件将会把内容插入到 <style>标签中,同时也带有 HMR 支持。也能够以字符串的形式检索处理后的,作为某模块默认导出的 CSS。

* Husky + lint-staged 的 Git 提交工作流继承

.husky 目录 pre-commit 的文件 里面包含了 git commit 前要执行执行的脚本。
当你执行 git commit 的时候 会首先执行 npm run lint 脚本,通过 Lint 检查后才会正式提交代码记录。
