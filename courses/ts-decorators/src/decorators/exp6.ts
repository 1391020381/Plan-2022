/**
 * 方法装饰器
 */

const loggerDecorator = () => {
    return function logMethod(
        target: any,
        propertyName: string,
        propertyDescriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const method = propertyDescriptor.value;

        // 重载方法
        propertyDescriptor.value = function async(...args: any[]) {
            try {
                return method.apply(this, args); // 调用之前的函数
            } finally {
                const now = new Date().valueOf();
                console.log(`lasted logged in ${now}`);
            }
        };
        return propertyDescriptor;
    };
};

class UserService {
    @loggerDecorator()
    async login() {
        console.log('login success');
        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }
}

export const exp6 = () => {
    console.log();
    console.log('-----------------------示例6:方法装饰器-----------------------');
    console.log('-----------------------使用装饰器重写示例1-----------------------');
    console.log();
    const user = new UserService();
    user.login();
    console.log();
    console.log('-----------------------示例6:执行完毕-----------------------');
};
