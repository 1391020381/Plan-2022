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
