interface IDescription {
    readonly name: string;
    age: number;
    male?: boolean;
    func?: Function
}
const obj1: IDescription = {
    name: 'linbudu',
    age: 599,
    male: true,
    func: () => { console.log('1111') }
}
type obj1Male = typeof obj1.male;
console.log(obj1.male, obj1.func())

const objTmp1:Object = undefined;
const objTmp2:Object = null;
const objTmp3:Object = void 0;


const temp17:object = undefined;
const temp18:object = null;

