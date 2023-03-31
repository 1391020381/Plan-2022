import 'reflect-metadata';
// decorators 装饰器的数组
// target 目标对象
// 返回应用提供的装饰器后的值

// function decorate(decorators: ClassDecorator[], target: Function): Function;
// declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;

export const classDecorator: ClassDecorator = (target) => {
    target.prototype.sayName = () => {
        console.log('override');
    };
};

export class TestClassDecrator {
    constructor(public name = '') {}

    sayName() {
        console.log(this.name);
    }
}

export const exp3 = () => {
    Reflect.decorate([classDecorator], TestClassDecrator);
    const t = new TestClassDecrator('nihao');
    t.sayName();
};

// 装饰器工厂
const SetNameDecorator = (firstname: string, lastname: string) => {
    const name = `${firstname}.${lastname}`;
    return <T extends new (...args: any[]) => any>(target: T) => {
        return class extends target {
            _name: string = name;

            getMyName() {
                return this._name;
            }
        };
    };
};
@SetNameDecorator('jesse', 'pincman')
export class UserService {
    c() {}
}
