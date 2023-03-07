/* eslint-disable func-names */

@AddProperty('linbudu')
@AddMethod()
class Foo {
    a = 1;
}

function AddMethod(): ClassDecorator {
    return (target: any) => {
        target.prototype.newInstanceMethod = () => {
            console.log("Let's add a new instance method!");
        };
        target.newStaticMethod = () => {
            console.log("Let's add a new static method!");
        };
    };
}

function AddProperty(value: string): ClassDecorator {
    return (target: any) => {
        target.prototype.newInstanceProperty = value;
        target.newStaticProperty = `static ${value}`;
    };
}
const OverrideBar = (target: any) => {
    return class extends target {
        print() {
            console.log('This is Overrided print!');
        }

        overridePrint() {
            console.log('This is Overrided Bar!');
        }
    };
};
@OverrideBar
class Bar {
    print() {
        console.log('This is Bar!');
    }
}
function ComputeProfiler(): MethodDecorator {
    return (_target, methodIdentifier, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethodImpl = descriptor.value!;
        descriptor.value = async function (...args: unknown[]) {
            const start = new Date();
            const res = await originalMethodImpl.apply(this, args);
            const end = new Date();
            console.log(`${String(methodIdentifier)} Time: `, end.getTime() - start.getTime());
            return res;
        };
    };
}
class Foo2 {
    @ComputeProfiler()
    async fetch() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('RES');
            }, 3000);
        });
    }
}
function Hijacketter(val: string): MethodDecorator {
    return (target, methodIdentifier, descriptor: any) => {
        const originalSetter = descriptor.set;
        descriptor.set = function (newValue: string) {
            const composed = `Raw:${newValue},Actual:${val}-${newValue}`;
            originalSetter.call(this, composed);
            console.log(`HijackSetter:${composed}`);
        };
    };
}
class Foo3 {
    _value!: string;

    get value() {
        return this._value;
    }

    @Hijacketter('LIN_BU_DU')
    set value(input: string) {
        this._value = input;
    }
}
function ModifyNickName(): PropertyDecorator {
    return (target: any, propertyIdentifier) => {
        console.log('ModifyNickName--------:', propertyIdentifier);
        target[propertyIdentifier] = '林不渡!';
        target['abcd'] = 'abcd';
        target['otherName'] = '别名林不渡!';
    };
}
class Foo4 {
    @ModifyNickName()
    nickeName!: string;

    // constructor() {}
}
function CheckParam(): ParameterDecorator {
    return (target, methodIdentifier, index) => {
        console.log('CheckParam--------', target, methodIdentifier, index);
    };
}
class Foo5 {
    handler(@CheckParam() input: string) {
        console.log('Foo5:', input);
    }
}
const exp12 = () => {
    const foo: any = new Foo();
    foo.newInstanceMethod();
    (<any>Foo).newStaticMethod();
    console.log(foo.newInstanceProperty);
    console.log((<any>Foo).newStaticProperty);

    new Bar().print();
    (<any>new Bar()).overridePrint();
    (async () => {
        console.log(await (<any>new Foo2()).fetch());
    })();
    const foo3 = new Foo3();
    foo3.value = 'LINBUDU';
    const foo4: any = new Foo4();
    console.log('new Foo4()---------------:', foo4, foo4.nickeName, foo4.otherName);
    console.log((<any>new Foo5()).handler('linbudu'));
};
export { exp12 };
