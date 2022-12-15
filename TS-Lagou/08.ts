// 基础类型  字面量类型  函数类型  接口类型  Type 。 类型收窄

// 联合类型  ||
// 交叉类型  &
// 合并接口类型

type IntersectionType = { id: number; name: string } & { age: number };

const mixed: IntersectionType = {
  id: 1,
  name: "name",
  age: 18,
};

type IntersectionTypeConfict = {
  id: number;
  name: string;
} & { age: number; name: number };

const mixedConfict: IntersectionTypeConfict = {
  id: 1,
  name: 2,
  age: 2,
};

// 合并联合类型
// 合并联合类型为一个交叉类型,这个交叉类型需要同时满足不同的联合类型限制,也就是提取了所有联合类型的相同成员。
// 如果多个联合类型中没有相同的类型成员,交叉出来的类型自然就是 never了。
type UnionA = "px" | "em" | "rem" | "%";
type UnionB = "vh" | "em" | "rem" | "pt";
type IntersectionUnion = UnionA & UnionB;

const intersectionA: IntersectionUnion = "em";
const intersectionB: IntersectionUnion = "rem";
const intersectionC: IntersectionUnion = "px";

// 联合 交叉组合

// 类型缩减

type URStr = "string" | string;
