type AnyType = boolean;
type AnyReturnType = string;
type AnyNextType = number;
function* gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true;
  return `${nextValue}`;
}
// TS => 箭头函数 用来表示函数的定义 其左侧是函数的参数类型  右侧是函数的返回值类型
// ES6中 => 是函数实现
// 参数类型  返回值  泛型

// ?：表示可以缺省 可以不传  也就是说调用函数时 我们可以不显示传入参数
{
  function log(x?: string) {
    return x;
  }
  log();
  log("hello world");
}
// = 默认参数
{
  function log2(x = "hello") {
    console.log(x);
  }
}
// 剩余参数
{
  function sum(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0);
  }
}
{
  function say() {
    console.log(this.name);
  }
}

{
  interface Person {
    name: string;
    say(this: Person): void;
  }
  const person: Person = {
    name: "captin",
    say() {
      console.log(this.name);
    },
  };
  const fn = person.say;
  fn();
}

{
  function isString(s): s is string {
    return typeof s === "string";
  }
}

// 参数类型 可选 默认 剩余 this   s is string
