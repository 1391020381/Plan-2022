console.log("function-and-class is ready!");

function foo(name: string): string {
  return name;
}

const fn: (name: string) => number = function (name) {
  return name.length;
};

// (name:string)=> number 在TS中 函数类型签名

// 要么直接在函数中进行参数和返回值的类型声明,要么使用类型别名将函数声明抽离出来。

type FuncFn = (name: string) => number;

const fn1: FuncFn = (name) => {
  return name.length;
};

interface FuncFooStruct {
  (name: string): number;
}

// Callable Interface

// 可选参数必须位于必选参数之后
// 对于 rest 参数的类型标准也比较简单,由于实际上是一个数组 ，这里我们也应当使用 数组类型进行标注

function fn2(arg1: string, ...rest: any[]) {}

function fn3(foo: number, bar: true): string;
function fn3(foo: number, bar?: false): number;
function fn3(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 59;
  }
}

// 异步函数 Generator 函数等类型签名

async function asyncFunc(): Promise<void> {}

function* genFn(): Iterable<void> {}
async function* asyncGenFunc(): AsyncIterable<void> {}

// 对与异步函数(即标记为async的函数) 其返回值必定为 一个 Promise类型,而 Promise内部包含的类型则通过泛型的形式书写,即Promsie<T>

// class
// 构造函数 属性 方法 访问符

class fnClass {
  private prop: string;
  constructor(inputProp: string) {
    this.prop = inputProp;
  }
  protected print(addon: string): void {
    console.log(`${this.prop} and ${addon}`);
  }
  public get propA(): string {
    return `${this.prop}+A`;
  }
  public set propA(value: string) {
    this.prop = `${value}+A`;
  }
}

// 类声明和类表达式
// public 类 类的实例 子类中都能访问
// private 此类成员仅能在类的内部被访问
// protected 类 子类
// readony
// 静态成员

class Class1 {
  static staticHandler() {}
  public instanceHandler() {}
}

// 派生类对基类成员的访问与覆盖操作
// 基类中的哪些成员能够被派生类访问,完全是由其访问性修饰符决定的。
// 基类中的方法也可以在派生类中被覆盖,但我们仍然可以通过super访问到基类中的方法。
// override 关键字 来确保派生类尝试覆盖的方法一定在基类中存在的定义
// 尝试覆盖的方法 未在基类中申明 就会报错提示

// 抽象类

// 基础类型标注 字面量类型与枚举 函数与Class 等概念时。
// 如何使用TS提供的内置类型在类型世界里获得更好的编程体验。
// 内置的可用于标注的类型 包括 any unknown never。
// 断言  双重断言 与非空断言  类型断言的幕后原理  类型层级

// 某些情况下 你的变量/参数也会被隐士地推导为any。 比如 使用 let 声明一个变量但不提供初始值,以及不为函数参数提供类型标注

// any 的本质是类型系统中顶级类型, 即 Top Type 这是 许多类型语言中重要概念。

// 类型不兼容报错 考虑使用类型断言替代

// 类型太复杂导致不想全部声明而使用any, 考虑将这一处的类型断言为你需要的最简单类型。
// foo.bar.baz() 就可以先将 foo 断言为一个具有 bar 方法的类型。

// 未知类型  unknown

// unknown 类型变量 可以再次赋值为任意其他类型,但只能赋值给 any unknown 类型的变量

let unknownVar: unknown = "linbudu";

unknownVar = false;
unknownVar = "linbudu";
unknownVar = {
  site: "juejin",
};
unknownVar = () => {};

const val1: string = unknownVar; //

const val5: any = unknownVar;
const val6: unknown = unknownVar;

let unknownVar2: unknown;
(unknownVar2 as { foo: () => {} }).foo();

type UnionWithNever = "linbudu" | 599 | true | void | never;

//  严格来说  never类型不携带任何的类型信息 因此会在联合类型中被直接移除

// never 类型被称为 Boottom Type 是整个类型系统层级中最底层的类型。
// 所有类型的子类型  但只有 never 类型 的变量能够赋值给另一个 never 类型变量

declare const strOrNumOrBool: string | number | boolean;
if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  strOrNumOrBool === true;
} else {
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}

// 类型断言

// as NewType
// 可以将 any /unknown类型断言到一个具体的类型。

// 双重断言
const str: string = "linbudu";

// (str as { handler: () => {} })
//   .handler()
(str as unknown as { handler: () => {} }).handler();

// 非空断言 ！
// obj!.func()!.prop 的形式标记前面的一个声明一定是非空的(实际就是剔除null undefined)

// TS类型工具

// 类型别名 主要作用是对一组类型或一个特定类型结构进行封装,以便于在其他地方进行复用。

type StatusCode = 200 | 301 | 400 | 500 | 502;

type PossibleDataTypes = string | number | (() => unknown);

const status: StatusCode = 502;

type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => {};
const moveHandler: Handler = (e) => {};

type Objtype = {
  name: string;
  age: number;
};

// 一旦接受了范型 我们就叫它工具类型

type Factory<T> = T | number | string;

const fn4: Factory<boolean> = true;

// 联合类型 与 交叉类型  ｜ &

interface NameStruct {
  name: string;
}
interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: "linbudu",
  age: 25,
};

// 索引类型 索引签名类型 索引类型查询 索引类型访问

interface AllStringTypes {
  [key: string]: string;
}
type AllStringTypes2 = {
  [key: string]: string;
};

type PropType1 = AllStringTypes["linbudu"];

interface StringOrBooleanTypes {
  propA: number;
  proB: boolean;
  [key: string]: number | boolean;
}

interface Foo {
  linbudu: 1;
  599: 2;
}
type FooKeys = keyof Foo;

// 直接通过 keyof any 来产生一个联合类型, 它会由所有可用作用对象键值的类型组成
// string | number | symbol
// keyof  的产物必定是一个联合类型

type Stringify<T> = {
  [K in keyof T]: string;
};

interface Foo4 {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifiedFoo = Stringify<Foo4>;

type Clone<T> = {
  [K in keyof T]: T[K];
};

// 类型查询操作符 typeof

const fn6 = (input: string) => {
  return input.length > 10;
};

const fn7: typeof fn6 = (name: string) => {
  return name === "linbudu";
};

const str2 = "linbudu";
const obj = { name: "linbudu" };

// TS引入了 is 关键字 来显示地提供类型信息

function isString(input: unknown): input is string {
  return typeof input === "string";
}

let name: any = "linbudu";
function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Not a number");
  }
}
assertIsNumber(name);

// 泛型

// 工具类型 Partial<T> 会将 传入的对象类型复制一份,但会额外添加一个?

// A extends B 意味着 A是B的子类型

// 多范型参数 其实就像接受更多参数的函数,其内部的运行逻辑(类型操作)会更加抽象,表现在参数(泛型参数) 需要进行的逻辑运算（类型操作）会更加复杂。

interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}
// 描述了一个通用的响应类型结构 预留出了实际响应数据的泛型坑位,然后在你的请求函数中就可以传入特定的响应式类型了。

interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({
        code: 200,
        error: "",
        data: { name: "justdoit", homepage: "xxx", avatar: "xxxx" },
      });
    }, 1000);
  });
}

interface IPaginationRes<TItem = unknown> {
  data: TItem[];
  page: number;
  totalCount: number;
  hasNextPage: boolean;
}

// function fetchUserProfileList():Promise<IRes<IPaginationRes<IUserProfileRes>>>{}

// 简单的泛型参数填充而已。 就像我们会封装请求库 请求响应拦截器一样

// 函数中的泛型

function handle<T>(input: T): T {
  return input;
}

// 函数声明了一个泛型参数T 并将参数的类型与返回值类型指向这个泛型参数。
// 这样 子啊函数接受到参数时,T会自动地被填充为整个参数的类型。

const author = "linbudu";
let authorAge = 18;

handle(author);
handle(authorAge);

// class  泛型
// class 中的泛型消费方 属性 方法 装饰器

class Queue<TElementType> {
  private _list: TElementType[];
  constructor(initial: TElementType[]) {
    this._list = initial;
  }
}

// 结构化类型系统

// Cat Dog 类型上的方法是一致的,所以它们虽然是两个名字不同的类型,但仍然被视作为结构一致 这就是结构化类型系统的特性。鸭子类型

// 条件类型   infer 关键字
// inter 关键字 在条件类型中提取类型的某一部分信息。

// 工具类型

// 原始类型 对象类型  字面量类型  函数 Class
// any unknown never
// 类型工具
// 泛型
// 结构化类型系统  类型层级
// infer
