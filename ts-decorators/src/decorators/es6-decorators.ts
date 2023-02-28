/**
 * 装饰器的执行步骤如下。
 * 1. 计算各个装饰器的值,按照从左到右,从上到下的顺序。
 * 2. 调用方法装饰器
 * 3. 调用类装饰器
 */

// 如果觉的一个参数不够用 可以在装饰器外面再封装一层函数。

function testable(isTestable) {
  return function (target) {
    target.isTestable = isTestable;
  };
}

@testable(true)
class MyTestableClass {}
// MyTestableClass.isTestable;

// 装饰器对类的行为的改变,是代码编译时发生的,而不是在运行时。
// 这意味着,装饰器能在编译阶段运行代码。也就是说 装饰器本质就是编译时执行的函数。
