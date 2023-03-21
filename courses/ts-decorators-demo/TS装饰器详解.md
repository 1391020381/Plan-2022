-   装饰器是一种特殊类型的声明,它能够被附加到类声明 方法 访问符 属性 或参数上。 类声明 方法 访问符 属性 参数
-   装饰器使用 @expression 这种形式, expression 求值后必须为一个函数。它会在运行时被调用,被装饰的声明信息作为参数传入。
-   装饰器一般用于处理一些 与 类 以及类属性本身无关的逻辑。

# 基本概念

## 柯里化

1. decorator 通过 Object.defineProperty 来修改 target key 的行为。
2. Object.getOwnPropertyDescriptor(target,key)
3. createDecorator(decorator){} 返回 一个函数接受 target key 返回 decorator(target,key,descriptor)

## 装饰器类型

1. 参数装饰器
2. 方法装饰器
3. 访问符装饰器
4. 属性装饰器
5. 类装饰器
