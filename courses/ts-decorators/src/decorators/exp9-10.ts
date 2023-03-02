/* eslint-disable func-names */

/**
 * 反射元元素
 */

import 'reflect-metadata';

import { parse, parseDecorator, UserType } from './exp7-8';

class Point {
    x: number;

    y: number;
}

class Line {
    private _p0: Point;

    private _p1: Point;

    @validate
    // 这句可以省略,因为design:type是预定义属性
    // @Reflect.metadata('design:type', Point)
    set p0(value: Point) {
        this._p0 = value;
    }

    get p0() {
        return this._p0;
    }

    @validate
    // @Reflect.metadata("design:type", Point)
    set p1(value: Point) {
        this._p1 = value;
    }

    get p1() {
        return this._p1;
    }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const { set } = descriptor;
    descriptor.set = function (value: T) {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError('Invalid type.');
        }
        set.apply(this, [value]);
    };
    return descriptor;
}

// 角色守卫
export const RoleGuardDecorator = (roles: string[]) => {
    console.log('开始验证角色');
    return function roleGuard(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // 根据传入的参数定义守卫所需的角色
        Reflect.defineMetadata('roles', roles, target, propertyKey);
        const method = descriptor.value;
        descriptor.value = function (...args: any[]) {
            // 获取当前用户的角色
            const currentRoles = target.getRoles();
            // 获取我们定义的操作此方法所需的角色
            const needRoles = Reflect.getMetadata('roles', target, propertyKey);
            // 判断当前用户是否拥有所需的角色,没有则抛出异常
            for (const role of needRoles) {
                if (!currentRoles.includes(role)) {
                    throw new Error(`you have not permission to run ${propertyKey}`);
                }
            }
            console.log('验证角色完毕');
            return method.apply(this, args);
        };
        return descriptor;
    };
};
export class UserService {
    protected users: UserType[] = [
        { id: 1, username: 'admin' },
        { id: 2, username: 'pincman' },
    ];

    getUsers() {
        return this.users;
    }

    // 设定当前用户的角色
    getRoles() {
        return ['user'];
    }

    @RoleGuardDecorator(['admin'])
    // 在装饰器中使用Reflect.defineMetadata()放定义roles只是为了方便封装
    // 当然,我们也可以在方法上直接定义roles,如下
    // Reflect.metadata('roles',['admin'])
    @parseDecorator
    delete(@parse((arg: any) => Number(arg)) id: number): UserService {
        this.users = this.getUsers().filter((userObj) => userObj.id !== id);
        return this;
    }
}

export const exp910 = () => {
    console.log();
    console.log('-----------------------示例9:基本元元素类型反射-----------------------');
    console.log('-----------------------为访问器的set方法添加类型验证-----------------------');
    console.log();
    const line = new Line();
    const p0 = new Point();
    p0.x = 1;
    p0.y = 2;
    line.p1 = p0;
    console.log(line);
    console.log();
    console.log('-----------------------示例9:执行完毕-----------------------');
    console.log();
    console.log('-----------------------示例10:自定义元元素反射-----------------------');
    console.log(
        '-----------------------添加角色守卫来判断当前用户是否有删除权限-----------------------',
    );
    console.log();
    const user = new UserService();
    user.delete(1);
    console.log(user.getUsers());
    console.log();
    console.log('-----------------------示例10:执行完毕-----------------------');
};
