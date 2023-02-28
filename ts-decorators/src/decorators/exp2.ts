const HelloDerorator = <T extends new (...args: any[]) => any>(
  constructor: T,
) => {
  return class extends constructor {
    newProperty = 'new property';

    hello = 'override';

    sayHello() {
      return this.hello;
    }
  };
};

@HelloDerorator
export class Hello {
  [key: string]: any; // 此处用于防止eslint提示sayHello方法不存在

  hello: string;

  constructor() {
    this.hello = 'test';
  }
}

const exp2 = () => {
  console.log(
    '-----------------------示例2:简单的类装饰器-----------------------',
  );
  console.log(
    '-----------------------动态添加一个sayHello方法以及覆盖hello的值-----------------------',
  );
  console.log();
  const hello = new Hello();
  console.log(hello.sayHello());
  console.log();
  console.log('-----------------------示例2:执行完毕-----------------------');
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

const exp3 = () => {
  console.log();
  console.log('-----------------------示例3:装饰器工厂-----------------------');
  console.log(
    '-----------------------通过继承方式 重载getName方法-----------------------',
  );
  console.log();
  const user: any = new UserService();
  console.log(user.getMyName());
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
  Original.prototype.userinfo = userinfo;
  function constructor(...args: any[]) {
    console.log('contruct has been changed');
    return new Original(...args);
  }
  constructor.prototype = Original.prototype;
  constructor.myinfo = `myinfo${userinfo}`;
  return constructor as typeof Original;
};
interface StaticUser {
  new (): UserProfile;
  myinfo: string;
}
@ProfileDecorator({ phone: 133, address: 'zhejiang' })
class ProfileService {}
const exp4 = () => {
  console.log();
  console.log(
    '-----------------------示例4:修类的构造函数,原型属性,静态属性等-----------------------',
  );
  console.log(
    '-----------------------设置原型属性值,重载构造方法,添加静态属性-----------------------',
  );
  console.log();
  console.log((ProfileService as unknown as StaticUser).myinfo);
  const profile = new ProfileService();
  console.log((profile as any).userinfo);
  console.log();
  console.log('-----------------------示例4:执行完毕-----------------------');
};
// 控制台打印 jesse.pincman
// 控制台打印 override
export { exp2, exp3, exp4 };
