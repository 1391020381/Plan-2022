export const HiddenDecorator = () => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    descriptor.enumerable = false;
  };
};

export const PrefixDecorator = (prefix: string) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    return {
      ...descriptor,
      set(value: string) {
        descriptor.set.apply(this, [`${prefix}_${value}`]);
      },
    };
  };
};

export class UserEntity {
  private _nickname: string;

  // @ts-ignore
  private fullname: string;

  @HiddenDecorator()
  @PrefixDecorator('jesse_')
  get nickname() {
    return this._nickname;
  }

  set nickname(value: string) {
    this._nickname = value;
    this.fullname = `${value}_fullname`;
  }
}

const exp8 = () => {
  // ...

  console.log();
  console.log(
    '-----------------------示例8:get/set装饰器-----------------------',
  );
  console.log(
    '-----------------------禁止nickname出现在遍历中,为nickname添加前缀-----------------------',
  );
  console.log();
  const user = new UserEntity();

  user.nickname = 'pincman';
  console.log(user);
  console.log(user.nickname);
  console.log();
  console.log('-----------------------示例8:执行完毕-----------------------');
};

// 第一个console.log控制台输出,可以看到遍历对象后并没有nickname字段的值
// UserService {
//  users: [ { id: 1, username: 'admin' }, { id: 2, username: 'pincman' } ],
//  roles: [],
//  hello: 'test',
//  password: '123456',
//  _nickname: 'gkr__lichnow',
//  fullname: 'gkr__lichnow_fullname'
//}
// 第二个console.log控制台输出
// gkr__lichnow
export { exp8 };
