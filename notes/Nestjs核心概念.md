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
