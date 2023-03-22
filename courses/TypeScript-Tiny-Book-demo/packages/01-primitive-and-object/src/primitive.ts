const name: string = "linbudu";
const age: number = 24;
const male: boolean = false;
const undef: undefined = undefined;
const nul: null = null;
const obj: object = { name, age, male };
const bigintVar1: bigint = 9007199254740991n;
const biginVar2: bigint = BigInt(9007199254740991);
const symbolVar: symbol = Symbol("unique");

// 在没有开启 stricNullChecks 检查的情况下,会被视作其他类型的子类型,比如 string类型会被认为包含了 null 与 undefined类型。

const tmp1: null = null;
const tmp2: undefined = undefined;

const tmp3: string = null;
const temp4: string = undefined;
