function Deco(identifier: string): any {
    console.log(`${identifier} 执行`);
    return function () {
        console.log(`${identifier} 应用`);
    };
}
@Deco('类装饰器')
class Foo {
    constructor(@Deco('构造函数参数装饰器') name: string) {
        console.log('name:', name);
    }

    @Deco('实例属性装饰器')
    prop?: number;

    @Deco('实例方法装饰器')
    handler(@Deco('实例方法参数装饰器') args: any) {}
}
const exp13 = () => {
    console.log('exp13');
    const foo = new Foo('装饰器执行和应用顺序');
    console.log('foo:', foo);
};

export { exp13 };
