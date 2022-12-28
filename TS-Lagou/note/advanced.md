# 类型守卫：如何有效保障类型的安全性

- 原始类型 字面量类型 数组类型
- 函数类型
- 类类型
- 接口类型
- 类型别名
- 联合类型与交叉类型
- 枚举类型
- 泛型

* 类型推断
* 类型断言
* 类型缩小 类型放大

* 类型守卫的作用在于触发类型缩小。 实际上 它还可以用来区分类型集合中的不同成员
* switch 字面量恒等 typeof instanceof in
* 自定义类型守卫
* 类型兼容:如何判断一个类型是否可以赋值给其他类型

* any 可以赋值给除了 never 之外的任意其他类型
* never 的特性是可以赋值给任何其他类型,但是反过来不能被其他任何类型赋值
* unknown 不能把 unknown 赋值给除了 any 之外任何其他类型。反过来可

## 类型兼容

- 所有的子类型与它的父类型都兼容

* 类型兼容性的另已准则是 结构类型,即如果两个类型的结构一致,则它们是相互兼容的。比如拥有相同的类型的属性 方法的接口类型或类 则可以相互赋值。
* 可继承和可实现
* 泛型类型 泛型类型的兼容性实际指的是将它们实例化为一个确切的类型后的兼容性

## 增强类型系统

### 声明

- 通过使用 declare 关键字 我们可以声明全局的变量 方法 类 对象

* 在运行时 前端代码 <script></script> 标签会引入一个全局的库,再导入全局变量。此时,如果想安全使用地使用全局变量,那么需要对变量的类型进行声明。
* 变量 函数 类 枚举

* 我们可以通过声明模块类型,为缺少 TS 类型定义的三方库或者文件补齐类型定义

```
// lodash.d.ts
declare module 'loadash'{
    export function first<T extends unknown>(array:T[]):T;
}
// index.ts
import { first} from 'lodash'
first([1,2,3])
```

- declare 文件

```
declare module '*.jpg'{
    const src:string;
    export default src;
}

```

- declare namespace

```

declare namespace ${
    const version:number;
    function ajax(setting?:any):void
}

$.version
$.ajax()

```

## 声明文件

- 在 TS 中 以 .d.ts 为后缀的文件为声明文件。

# TS 官方 TS 类型
