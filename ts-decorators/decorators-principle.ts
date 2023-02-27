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
    const target = Model.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    decorator(target, key, descriptor);
  };
const logger: DecoratorFunc = (target, key, descriptor) =>
  Object.defineProperty(target, key, {
    ...descriptor,
    value: async (...args: any[]) => {
      try {
        return descriptor.value.apply(this, args);
      } finally {
      }
    },
  });
