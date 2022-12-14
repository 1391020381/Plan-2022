let arrayOfNumber: number[] = [1, 2, 3];
let arrayOfString: string[] = ["x", "y", "z"];
let arrayofGeneric: Array<number> = [1, 2, 3, 4];

// 元组
// 元组最重要的特性是可以限制数组元素的个数和类型,它特别适合用来实现多值返回

// 我们可以将任意类型的值赋值给unknown,但 unknown类型只能赋值给 unknown 或any。

let result: unknown;
result.toFixed();

if (typeof result == "number") {
  result.toFixed();
}

// void 类型 它仅仅适用于表示返回值的函数。即如果该函数没有返回值,那它的类型就是void

// 类型守卫 在操作之前判断值的类型是否支持当前的操作。
// 类型守卫既能通过类型缩小影响TS的类型检测,也能保障JS运行时的安全性。

// 非空断言
// userInfo.id!.toFixed()

// 比非空断言更安全 类型守卫更方便的做法是 使用单问号  双问号(空值合并

const userInfo = {
  id: 2,
  name: null,
};
console.log(userInfo.id?.toFixed());
console.log(userInfo.name ?? `my name is ${userInfo.id}`);

// never 表示永远不会发生值的类型

// 但是反过来 除了 never自身以外 其他类型 (包括any在内的类型)都不能为 never类型赋值
// never是所有其他类型的子类型

const str3: string = "string";
if (typeof str == "number") {
  str.toLowerCase();
}

const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find((num) => num > 2) as number;
