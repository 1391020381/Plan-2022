// 类装饰器其实就是把我们本身的类传入装饰器注解中,并对这个类或类的原型进行一些处理。
const HelloDerorator = <T extends new (...args: any[]) => any>(constructor: T) => {
    return class extends constructor {
        newProperty = 'new property';

        hello = 'override';

        sayHello() {
            return this.hello;
        }
    };
};
const SetNameDecorator = (firstname: string, lastname: string) => {
    const name = `${firstname}.${lastname}`;
    return <T extends new (...args: any[]) => any>(target: T) => {
        return class extends target {
            _name: string = name;

            getMyName() {
                return this._name;
            }
        };
    };
};
@SetNameDecorator('jesse', 'pincman')
class UserService {
    c() {}
}
@HelloDerorator
export class Hello {
    [key: string]: any;

    hello: string;

    constructor() {
        this.hello = 'test';
    }
}
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
    Original.prototype.userinfo = userinfo;

    function constructor(...args: any[]) {
        console.log('construct has been changed');
        return new Original(...args);
    }
    constructor.prototype = Original.prototype;

    constructor.myinfo = `myinfo ${userinfo}`;

    return constructor as typeof Original;
};

interface StaticUser {
    new (): UserProfile;
    myinfo: string;
}

@ProfileDecorator({ phone: 133, address: 'zhejiang' })
class ProfileService {}
const exp2 = async () => {
    const hello = new Hello();
    console.log(hello.sayHello());
    const user = new UserService();
    console.log((user as any).getMyName());
    console.log('ProfileService:', (ProfileService as unknown as StaticUser).myinfo);
    const profile = new ProfileService();
    console.log((profile as any).userinfo);
};

export { exp2 };
