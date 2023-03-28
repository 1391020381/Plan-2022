// interface 用来描述对象 类的结构
interface IObjectStruct {
  name: string;
  age: number;
  male: boolean;
}

type PossibleSource = "juejin" | "zhihu" | "segmentfault";

type Handler = () => Promise<void>;
