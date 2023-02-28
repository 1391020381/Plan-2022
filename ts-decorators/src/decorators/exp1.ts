var f = (v) => v;

var f = function (v) {
  return v;
};

/**
 * 使用高阶函数
 * 柯里化解构登录与日志记录
 */

type DecoratorFunc = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => void;

// 模拟的装饰器工厂函数
const createDecorator =
  (decorator: DecoratorFunc) => (Model: any, key: string) => {
    // 获取即将使用装饰器的类原型
    const target = Model.prototype;
    // 获取这个原型上某个方法的描述
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    // 更改描述,生成新的方法
    decorator(target, key, descriptor);
  };

const logger: DecoratorFunc = (target, key, descriptor) =>
  // 将修改后的函数重新定义到原型链上
  Object.defineProperty(target, key, {
    ...descriptor,
    value: async (...args: any[]) => {
      try {
        return descriptor.value.apply(this, args); // 调用之前的函数
      } finally {
        const now = new Date().valueOf();
        console.log(`lasted logged in ${now}`);
      }
    },
  });

class User {
  async login() {
    console.log('login success');
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
}

const exp1 = () => {
  console.log();
  console.log(
    '-----------------------示例1:高阶函数柯里化(装饰器内部原理)-----------------------',
  );
  console.log(
    '-----------------------实现登录和日志记录解耦-----------------------',
  );
  console.log();
  const loggerDecorator = createDecorator(logger);
  loggerDecorator(User, 'login');
  const user = new User();
  user.login();
  console.log();
  console.log('-----------------------示例1:执行完毕-----------------------');
};

// 控制台输出
// login success
// 停顿100ms
// lasted logged in 1571771681793

export { exp1 };
