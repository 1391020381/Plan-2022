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
@SetNameDecorator('jesse', 'pincma')
class UserService {
  c() {}
}
const exp3 = () => {
  console.log();
  console.log('-------示例3: 装饰器');
};
