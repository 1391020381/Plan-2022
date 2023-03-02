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

# 提供者详解

- 通俗的来讲,提供者就是通过类型提示或者标识符的方式使某个类或函数以依赖的方式在其它需要使用到它的地方进行实例化。

* 在 nestjs 中如果要使一个类变成提供者,需要在其顶部添加 @Injectable()装饰器

## 注册与导出

- 提供者需要在模块元元素的 providers 中注册才可以被本模块的其他类注入,需要在 exports 中导出后才能被其他模块调用。

## 自定义提供者

## 模块详解

### 共享模块

### 全局模块

### 动态模块

# https://docs.nestjs.com/

# nestjs/cli

- npm i -g @nestjs/cli
- nest new project-name
- 目录 平台 启动

# Controllers

- nest g resource [name] 一个单独的模块

* @Request() @Req() req
* @Response() @Res() res @Res() is simply an alias for @Response()
* @Next() next
* @Session() req.session
* @Param(key?:string) req.params / req.paramsp[key]
* @Body(key?:string) req.body / req.body[key]
* @Query(key?:string) req.query / req.query[key]
* @Headers(name?:string) req.headers /req.headers[name]
* @Ip() req.ip
* @HostParams() req.hosts

* Route wildcards 路由通配符
* Status code @HttpCode
* Headers @Headers
* Redirection @Redirection
* Route parameters

* Request payloads DTO(Data Transfer Object) schema.

# Providers
