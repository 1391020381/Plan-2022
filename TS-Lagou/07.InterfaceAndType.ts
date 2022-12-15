interface ProgramLanguage {
  name: string;
  age: () => number;
}

function NewStudy(language: ProgramLanguage) {
  console.log(
    `ProgramLanguage ${language.name} created ${language.age} years ago`
  );
}

// 可缺省属性  ?
// 当属性被标注为可缺省后 它的类型就变成了显示指定的类型与undefined 类型组成的联合类型
// readonly
// 函数类型   仅仅是定义函数的类型 而不包含函数的实现

interface LanguageRankInterface {
  [rank: number]: string;
}
interface LanguageYearInterface {
  [name: string]: number;
}
let LanguageRankMap: LanguageRankInterface = {
  1: "TS",
  2: "JS",
};

let LanguageMap: LanguageYearInterface = {
  TS: 2012,
  JS: 1995,
};

{
  interface StringMap {
    [prop: string]: number;
    age: number;
    name: string;
  }
  interface NumberMap {
    [rank: number]: string;
    1: string;
    0: number;
  }
}

// interface extends

// Type 类型别名
