const arr1:string[] = [];
const arr2:Array<string> = [];
const arr4:[string,string,string] = ['lin','bu','du'];
console.log(arr4[2])
const arr5:[string,number,boolean] = ['linbudu',599,true]

const arr6:[string,number?,boolean?] = ['linbudu']

// 类型别名 type  类型查询 typeof   联合类型
type TupleLength = typeof arr6.length;

// 具名元组

const arr7:[name:string,age:number,male:boolean] = ['linbudu',599,true]

console.log(arr7,arr7[0])
