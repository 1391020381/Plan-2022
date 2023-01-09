interface IRes {
    code:number;
    status:string;
    data:any
}
interface Res{
    code:10000| 10001 | 50000;
    status:"success" | "failure";
    data:any
}
// 快速生成一个符合指定类型,但没有实际值的变量，同时它也不存在于运行时中。
declare var res:Res;