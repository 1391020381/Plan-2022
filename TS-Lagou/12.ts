let neverValue: never;
let anyValue: any;
neverValue = anyValue;
anyValue = neverValue;
let unknownValue: unknown;
let stringValue: string = unknownValue;
unknownValue = stringValue;

{
  class C1 {
    name = "1";
  }

  class C2 {
    name = "2";
  }

  interface I1 {
    name: string;
  }

  interface I2 {
    name: string;
  }

  let InstC1: C1;

  let InstC2: C2;

  let O1: I1;

  let O2: I2;

  InstC1 = InstC2; // ok

  O1 = O2; // ok

  InstC1 = O1; // ok

  O2 = InstC2; // ok
}
// 协变也就是说 如果Dog是 Animal的子类型 则 F(Dog) 是 F(Animal)的子类型
// 这意味着在构造的复杂类型中保持了一致的子类型关系。
{
  type isChild<Child, Par> = Child extends Par ? true : false;
  interface Animal {
    name: string;
  }
  interface Dog extends Animal {
    woof: () => void;
  }
  type Covariance<T> = T;
  type isCovariant = isChild<Covariance<Dog>, Covariance<Animal>>;
}

{
  type Contravariance<T> = (param: T) => void;
  // TS 严格模式 设定函数参数类型是 逆变的。
}
