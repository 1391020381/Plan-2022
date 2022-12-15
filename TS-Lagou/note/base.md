# 基本类型

1. string
2. number
3. boolean
4. null
5. undefined
6. symbol

## 数组

1. 数组类型(Array)

```
let arrayOfNumber:number[] = [1,2,3]
let arrayOfString:string[] = ['x','y','z']

const x:[State,SetState] = [state,setState]
const y:[SetState,State] = [setState,state]

```

## any

## unknown

- 与 any 不同的是 ，unknown 在类型上更安全。 比如我们可以将任意类型的值赋值给 unkown,但是 unknown 类型的值只能赋值给 unknown 或 any

* 而所有类型缩小手段对 unknown 都有效

## void undefined null

## never

- 表示永远不会发生的类型。

## object

- object 类型表示非原始类型的类型。

## 类型断言 (Type Assertion) as

# 字面量类型 类型推断 类型拓宽 类型缩小

- 对 null undefined 的类型进行拓宽 通过 let var 定义的变量如果满足未显示声明类型注解且被赋予了 null 或 undefined 值 则推断出这些变量的类型是 any。

* 我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小 较明确的集合 Type Narrowing

* let 声明的简单类型字面量会拓宽类型
* const 声明的简单类型字面量会收窄
* const 声明的对象变量会自动推断对应的类型 as const 收窄 让每个 key 都是固定类型。

# 函数类型

- 参数 返回值 默认 可选 剩余

* this 重载

# 类类型

- 继承 public private protected static readonly set get
- 抽象类 implements
- 类的类型

# 接口 interface

- 可选？
- 只读

* 函数类型
*
