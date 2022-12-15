// TS 基于赋值表达式推断类型的能力称之为 类型推断

// 在TS中 具有初始化值的变量 有默认值的函数参数  函数返回的类型 都可以根据上下文推断出来。

function add2(a: number, b = 1) {
  return a + b;
}
console.log(add2(1));

// 上下文推断

// 字面量类型

type Direction = "up" | "down";
function move(dir: Direction) {
  console.log(dir);
}
move("up");
move("right");

interface Config {
  size: "small" | "big";
  isEnbale: true | false;
  margin: 0 | 2 | 4;
}

// const 定义为一个不可变的常量 在缺省类型注解的情况下,TS推断出它的类型直接由赋值字面量的类型决定。

// let 缺省显示类型注解的可变更的变量的类型转换为了赋值字面量类型的父类型。

{
  let x = null;
  let y = undefined;
  const z = null;
}

{
    let func = (anything:string|number){
        if(typeof anything === 'string'){
            return anything
        }else{
            return anything
        }
    }
}


{
    let str  = 'this is string';
    let strFun = (str= 'this is string') => str
    const specifiedStr = 'this is string';
    let str2 = specifiedStr
    let strFun2 = (str = specifiedStr)=>str
}

{
    let x = null;
    let y = undefined
    const z = null
    let anyFun = (param=null)=>param
    let z2 = z;
    let x2 = x
    let y2 = y
}