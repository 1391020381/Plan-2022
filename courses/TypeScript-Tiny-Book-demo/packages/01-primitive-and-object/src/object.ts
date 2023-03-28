// 我们使用 interface声明一个结构,然后使用 这个结构来作为一个对象的类型标注即可

interface IDescription {
  readonly name: string;
  age: number;
  male?: boolean;
  func?: Function;
}

const obj1: IDescription = {
  name: "linbudu",
  age: 599,
  male: true,
};

const obj2: IDescription = {
  name: "linbudu",
  age: 599,
  male: true,
};

// obj2.func();
// obj2.name = "xxxx";
