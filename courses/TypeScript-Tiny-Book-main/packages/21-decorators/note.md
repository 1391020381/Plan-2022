- 装饰器的本质其实就是一个函数,只不过它的入参是提前确定好的。
- 同时 TS 中的装饰器目前 只能在类以及类成员上使用。

* 装饰器通过 @ 语法来使用
* 实际上使用更多的是 Decorator Factory,即装饰器工厂的形式

```
function Deco(){
    return ()=>{}
}

@Deco()
class Foo{}

```

- 程序执行时会先执行 Deco() 再用内部返回的函数作为装饰器的实际逻辑。

# 类装饰器

- 类装饰器是直接作用在类上的装饰器,它在执行时的入参只有一个,那就是这个类本身（而不是类的原型对象）。

* 因此 我们可以通过类装饰器来覆盖类的属性与方法,如果你在类装饰器中返回一个新的类,它甚至可以篡改整个类的实现。

# 方法装饰器

- 方法装饰器的入参包括 类的原型 方法名 方法的属性描述符（PropertyDescriptor）

# 访问符装饰器

- 访问符装饰器本质上仍然是方法装饰器,它们使用的类型定义也相同。
- 访问符装饰器只能同时应用到一对 getter setter 的其中一个。

# 属性装饰器

- 属性装饰器在独立使用时能力非常有限,它的入参 只有 类的原型 与 属性名称,返回值会被忽略,但你仍然可以通过 直接在类的原型上赋值来修改属性。

# 参数装饰器

- 参数装饰器包括了构造函数的参数装饰器 与 方法的参数装饰器
- 它的入参 包括 类的原型 参数所在的方法名 参数在函数参数中的索引值（第几个参数）

* 类装饰器（类本身）
* 方法 访问符（类的原型、方法名以及方法的属性描述符（PropertyDescriptor））
* 参数装饰器 类型原型 方法名 参数位数

# 不同装饰器的执行时机与顺序是如何的？

- 执行时机 执行原理 执行顺序

* 执行是装饰器求值得到最终装饰器表达式的过程
* 而应用则是 最终装饰器逻辑代码执行的过程。

* 主要关注应用顺序 顺系大致是 实例属性 -> 实例方法参数 -> 构造函数参数 - 类

```


// @ts-nocheck

function classDeco(): ClassDecorator {
  return (target: Object) => {
    console.log('Class Decorator Invoked');
    console.log(target);
  };
}

function propDeco(): PropertyDecorator {
  return (target: Object, propertyKey: string) => {
    console.log('Property Decorator Invoked');
    console.log(propertyKey);
  };
}

function methodDeco(): MethodDecorator {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    console.log('Method Decorator Invoked');
    console.log(propertyKey);
  };
}

function paramDeco(): ParameterDecorator {
  return (target: Object, propertyKey: string, index: number) => {
    console.log('Param Decorator Invoked');
    console.log(propertyKey);
    console.log(index);
  };
}




```
