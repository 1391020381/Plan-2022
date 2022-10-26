- [juejin-book-vite](https://github.com/1391020381/juejin-book-vite)

# CSS

- 导入 .css 文件将会把内容插入到 <style>标签中,同时也带有 HMR 支持。也能够以字符串的形式检索处理后的,作为某模块默认导出的 CSS。

* Husky + lint-staged 的 Git 提交工作流继承

.husky 目录 pre-commit 的文件 里面包含了 git commit 前要执行执行的脚本。
当你执行 git commit 的时候 会首先执行 npm run lint 脚本,通过 Lint 检查后才会正式提交代码记录。

# VW

- VW 单位实现弹性布局

* vw: 1% of viewport's width
* vh: 1% of viewport's height
* viewport 即浏览器可视区域时大小
* 100vw = window.innerwidth
* 100vh = window.innerheight
* 在移动端我们一般认为 100vw 就是屏幕宽度。若是使用 vw 布局,就不需要再像 rem 那样,在 js 中去动态设置根元素的 font-size
