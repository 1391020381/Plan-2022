// Partial
// Partial 工具类型可以将一个类型的所有属性变为可选的,且该工具类型返回的类型是给定类型的所有子集。

// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };

interface Person {
  name: string;
  age?: number;
  weight?: number;
}
