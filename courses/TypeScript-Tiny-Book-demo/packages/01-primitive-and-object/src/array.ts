const arr1: string[] = [];
const arr2: Array<string> = [];

// 元组 (Tuple)

const arr4: [string, string, string] = ["lin", "bu", "du"];

console.log(arr4[599]);

const arr5: [string, number, boolean] = ["linbudu", 5999, true];
console.log(arr5[0], arr5[1], arr5[2]);

const arr6: [string, number?, boolean?] = ["linbudu"];
console.log(arr6.length);

const arr7: [name: string, age: number, male: boolean] = ["linbudu", 599, true];

console.log(arr7[0]);
