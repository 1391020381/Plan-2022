// 反射Reflect

// Proxy(target, {
//     set: function (target, name, value, receiver) {
//         var success = Reflect.set(target, name, value, receiver);
//         if (success) {
//             console.log('property' + name + 'on' + target + 'set to' + value);
//         }
//     },
// });
class Foo {
    constructor() {
        console.log('Foo');
    }

    hello() {
        console.log('Foo hello');
    }
}
const exp14 = () => {
    console.log('exp14');
    const foo = new Foo();
    foo.hello();
    const foo1 = Reflect.construct(Foo, []);
    const hello = Reflect.get(foo, 'hello');
    Reflect.apply(hello, foo1, []);
};

export { exp14 };
