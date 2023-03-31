/**
 * 类装饰器
 */

const HelloDecorator = <T extends new (...args: any[]) => any>(model: T) => {
    return class extends model {
        newProperty = 'new property';

        hello = 'override';

        sayHello() {
            return this.hello;
        }
    };
};

@HelloDecorator
export class Hello {
    [key: string]: any; // 此处用于防止tsconfig提示sayHello方法不存在

    hello: string;

    constructor() {
        this.hello = 'test';
    }
}

const exp2 = () => {
    console.log('-----------------------示例2:简单的类装饰器-----------------------');
    console.log(
        '-----------------------动态添加一个sayHello方法以及覆盖hello的值-----------------------',
    );
    console.log();
    const hello = new Hello();
    console.log(hello.sayHello());
    console.log();
    console.log('-----------------------示例2:执行完毕-----------------------');
};

const SetNameDecorator = (firstName: string, lastName: string) => {
    const name = `${firstName}.${lastName}`;
    return <T extends new (...args: any[]) => any>(model: T) => {
        return class extends model {
            _name: string = name;

            getName() {
                return this._name;
            }
        };
    };
};

@SetNameDecorator('jesse', 'pincman')
class UserService {
    getName() {}
}

const exp3 = () => {
    console.log();
    console.log('-----------------------示例3:装饰器工厂-----------------------');
    console.log('-----------------------通过继承方式 重载getName方法-----------------------');
    console.log();
    const user = new UserService();
    console.log(user.getName());
    console.log();
    console.log('-----------------------示例3:执行完毕-----------------------');
};

type UserProfile = Record<string, any> & {
    phone?: number;
    address?: string;
};

const ProfileDecorator = (profile: UserProfile) => (target: any) => {
    const Original = target;
    let userinfo = '';
    Object.keys(profile).forEach((key) => {
        userinfo = `${userinfo}.${profile[key].toString()}`;
    });
    // 添加一个原型属性
    Original.prototype.userinfo = userinfo;

    // 使用函数创建一个新的类(类构造器),返回值为传入类的对象,这样就重载了构造函数
    function constructor(...args: any[]) {
        console.log('construct has been changed');
        return new Original(...args);
    }
    // 赋值原型链
    constructor.prototype = Original.prototype;

    // 添加一个静态属性
    constructor.myInfo = `myInfo ${userinfo}`;

    // 1.所有属性跟Orginal相同，也就是ProfileService的属性+userinfo属性，
    // 2.在创建constructor函数(可以理解函数就是一个类)的实例时会输出一段'construct has been changed'
    // 3.添加一个静态属性,myinfo

    return constructor as typeof Original;
};

// 因为静态属性是无法通过[key: string]: any;获取类型提示的,所以这里添加一个接口用于动态各类添加静态属性
interface StaticUser {
    new (): UserService;
    myInfo: string;
}

@ProfileDecorator({ phone: 133, address: 'zhejiang', xxx: 'yyy' })
class ProfileService {}

const exp4 = () => {
    console.log();
    console.log(
        '-----------------------示例4:修类的构造函数,原型属性,静态属性等-----------------------',
    );
    console.log(
        '-----------------------设置原型属性值,重载构造防反,添加静态属性-----------------------',
    );
    console.log();
    console.log((ProfileService as unknown as StaticUser).myInfo);
    const profile = new ProfileService();
    console.log((profile as any).userinfo);
    console.log();
    console.log('-----------------------示例4:执行完毕-----------------------');
};
export { exp2, exp3, exp4 };
