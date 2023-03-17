## Request payloads

- 类是 JavaScript ES6 标准的一部分，因此它们在编译后的 JavaScript 中被保存为真实的实体。另一方面，由于 TypeScript 接口在编译过程中被移除，所以 Nest 不能在运行时引用它们。这很重要，因为当管道等特性在运行时访问变量的元类型时，它们提供了额外的可能性。

# Custom providers 自定义 providers

## DI fundamentals （标准依赖注入）

- 标准依赖注入的步骤

1. In cats.service.ts, the @Injectable() decorator declares the CatsService class as a class that can be managed by the Nest IoC container.
2. In cats.controller.ts, CatsController declares a dependency on the CatsService token with constructor injection:
3. In app.module.ts, we associate the token CatsService with the class CatsService from the cats.service.ts file. We'll see below exactly how this association (also called registration) occurs.

- The providers property takes an array of providers. So far, we've supplied those providers via a list of class names. In fact, the syntax providers: [CatsService] is short-hand for the more complete syntax

```

providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
]

```

- Now that we see this explicit construction, we can understand the registration process. Here, we are clearly associating the token CatsService with the class CatsService. The short-hand notation is merely a convenience to simplify the most common use-case, where the token is used to request an instance of a class by the same name

* Module providers

* provide 是字符串的时候, 通过 @Inject('ID-EXAMPLE') private idExp: ExampleProvider 注入
* provide 是 class 时候 可以通过 private valExp: ExampleProvider 构造函数来注入

# 模块详解

- 模块是一个功能的集合，比如 user forum 等 包含了各自控制器 服务等等。

## Feature modules

## Shared modules

1. we first need to export the CatsService provider by adding it to the module's exports array,
2. Now any module that imports the CatsModule has access to the CatsService and will share the same instance with all other modules that import it as well.

## Module re-exporting

- In addition, they can re-export modules that they import

## Dependency injection

## Global modules

- @Global

## Dynamic modules

- Provides 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provide - service , repository factory helper 等等。 他们都可以通过 constructor 注入依赖关系。这意味着对象可以彼此创建各种关系,并且 连接 对象实例的功能在很大程度上可以委托给 Nest 运行时系统。Provider 只是一个用@Injectable() 装饰器注释的类。

* @Injecttable() 附加有元数据,因此 Nest 知道这个类是一个 Nest provider。
* 在 Nest 中 借助 ts 功能 管理依赖项非常容易,因此它们仅按类型进行解析。Nest 将 catsService 通过创建并返回一个实例来解析 CatsService。解析此依赖关系并将其传递给控制器的构造函数（或分配给指定的属性

# 了解依赖注入 Angular

- 注入依赖项的最常见的方法是在类的构造函数中声明它。当创建时 会通过查看构造函数的参数类型来确定该类需要哪些服务 或 其他依赖项。

# 序列化

- ClassSerializerInterceptor

* 序列化(Serialization)是一个在网络响应中返回对象前的过程。
* 为了提供一种直接的方式来执行这些操作,Nest 附带了这个 ClassSerializerInterceptor 类。 它使用类转换器来提供转换对象的声明性和可扩展方式。基于此类基础下,可以从类转换器中获取方法和调用 classToPalin() 函数返回的值。要这样做，可以将由 class-transformer 装饰器提供的规则应用在实体/DTO 类中。
