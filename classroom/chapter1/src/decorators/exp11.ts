/* eslint-disable func-names */

/**
 * 装饰器调用顺序
 */
import { UserType } from './exp7-8';
import { UserService as ParentUserService } from './exp9-10';

const requiredMetadataKey = Symbol('required');

export const RequiredDecorator = (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
) => {
    const existingRequiredParameters: number[] =
        Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
};

export const ValidateDecorator = (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const requiredParameters: number[] = Reflect.getOwnMetadata(
            requiredMetadataKey,
            target,
            propertyName,
        );
        if (requiredParameters) {
            for (const parameterIndex of requiredParameters) {
                if (parameterIndex >= args.length || args[parameterIndex] === undefined) {
                    throw new Error('Missing required argument.');
                }
            }
        }

        return method.apply(this, args);
    };
};

class UserService extends ParentUserService {
    createUser(@RequiredDecorator username?: string, id?: number) {
        const ids: number[] = this.users.map((userEntity) => userEntity.id);
        const newUser: UserType = {
            // 如果不提供ID参数,则新用户的ID为所有用户的最大ID + 1
            id: id || Math.max(...ids) + 1,
            // 如果不提供username参数,则生成随机字符串作为用户名
            username: username || Math.random().toString(36).substring(2, 15),
        };
        this.users.push(newUser);
        return newUser;
    }
}

export const exp11 = () => {
    console.log();
    console.log('-----------------------示例11:装饰器组合-----------------------');
    console.log('-----------------------为username参数提供必填验证-----------------------');
    console.log();
    const user = new UserService();
    user.createUser();
    console.log(user.getUsers());
    console.log();
    console.log('-----------------------示例11:执行完毕-----------------------');
};
