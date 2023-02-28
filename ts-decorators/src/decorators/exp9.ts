// 装饰器写法

// 继承法

const a = <T extends new (...args: any[]) => any>(target: T) => {
  return class extends target {
    getMyName() {
      return this._name;
    }
  };
};
