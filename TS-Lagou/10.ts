// 比如我们可以通过 尖括号 <> 语法给函数 定义一个泛型参数P ,并指定params参数的类型为P

{
  function reflect<P>(params: P): P {
    return params;
  }
  // 在调用函数时,我们也可以通过 <> 语法指定了如下所示的 string number类型入参
  const reflectStr = reflect<string>("string");
  // 另外 如果调用泛型函数时受泛型约束的参数有传值, 泛型参数的入参可以从参数的类型中进行推断,而无须再显示指定类型(可缺省)
  reflect("234234");
}
/**
 * 泛型不仅可以约束函数整个参数的类型  还可以约束参数属性 成员类型
 */

function useState<S>(state: S, initialValue?: S) {
  return [state, (s: S) => void 0] as unknown as [S, (s: S) => void];
}

// 函数的泛型入参必须和参数/参数成员建立有效的约束才有实际意义。

function reflectExtraParams<P, Q>(p1: P, p2: Q): [P, Q] {
  return [p1, p2];
}

// 泛型  函数

// 泛型  类

class Memory<S> {
  store: S;
  constructor(store: S) {
    this.store = store;
  }
  set(store: S) {
    this.store = store;
  }
  get() {
    return this.store;
  }
}

// 泛型类型
const reflectFn: <P>(params: P) => P = reflect;

type ReflectFunction = <P>(params: P) => P;
interface IReflectFunction {
  <P>(params: P): P;
}
const reflectFn2: ReflectFunction = reflect;
const reflectFn3: IReflectFunction = reflect;

/**
 * 将类型入参的定义移动到类型别名 或 接口名称后,此时定义的一个具体类型入参后返回一个新类型的类型就是泛型类型
 */
// 泛型类型
type GenericReflectFunction<P> = (params: P) => P;

interface IGenericReflectFunction<P> {
  (params: P): P;
}

const reflectFn4: GenericReflectFunction<string> = reflect;
const reflectFn5: GenericReflectFunction<number> = reflect;
const reflectFn3Return = reflectFn4("string");

type StringOrNumberArray<E> = E extends string | number ? E[] : E;

// 泛型约束
function reflectSpecified<P extends number | string | boolean>(params: P): P {
  return params;
}
