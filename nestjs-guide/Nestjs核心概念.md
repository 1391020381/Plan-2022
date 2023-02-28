# 请求方法

1. @Get 用于获取数据
2. @Post 用于新增数据
3. @Patch 用于更新部分数据
4. @Put 用于更新全部数据
5. @Delete 用于删除数据
6. @Options 用于对 cors 的跨域预检（一般用不到）
7. @Head 用于自定义请求头 常用于下载 导出 excel 文件

# 请求对象

1. @Request(),@Req 请求数据。
2. @Response() @Res() 响应数据
3. @Next() 执行下一个中间件(一般用不到)
4. @Session() session 对象（一般用不到）

# DTO 与数据验证

- dto 是用于对请求数据结构进行定义的一个类,用于 aop 编程。
- 常用于对 body query 等请求数据进行验证。
- 常用的验证库 class-validator
