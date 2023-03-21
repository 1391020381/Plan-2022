/**
 * 使用高阶函数
 * 柯里化解构登录与日志记录
 * createDecorator 传入一个装饰器函数 返回一个函数 target key  返回  decorator(target,key)
 *
 */

type DecoratorFunc = (target: any, key: string, descriptor: PropertyDescriptor) => void;

// 模拟的装饰器工厂函数
const createDecorator = (decorator: DecoratorFunc) => (Model: any, key: string) => {
    // 获取即将使用装饰器的类原型
    const target = Model.prototype;
    // 获取这个原型上某个方法的描述
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    // 更改描述 生成新的方法
    decorator(target, key, descriptor);
};

const logger: DecoratorFunc = (target, key, descriptor) => {
    // 将修改后的函数重新定义到原型链上
    Object.defineProperty(target, key, {
        ...descriptor,
        value: async (...args: any[]) => {
            try {
                return descriptor.value.apply(this, args);
            } finally {
                const now = new Date().valueOf();
                console.log(`lasted logged in ${now}`);
            }
        },
    });
};
class User {
    async login() {
        console.log('login success');
        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }
}
const exp1 = async () => {
    // logger装饰器函数 createDecorator 返回 一个新函数 给装饰器函数中传入 target key
    const loggerDecorator = createDecorator(logger);
    loggerDecorator(User, 'login');
    const user = new User();
    user.login();
};

export { exp1 };

// decorator 通过 Object.defineProperty 来修改 target key 的行为。
// Object.getOwnPropertyDescriptor(target,key)
// createDecorator(decorator){} 返回 一个函数接受 target key 返回 decorator(target,key,descriptor)
