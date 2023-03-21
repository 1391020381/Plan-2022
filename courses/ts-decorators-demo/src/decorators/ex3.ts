/**
 * 属性装饰器一般不单独使用 主要用于配合类 或方法装饰器进行组合装饰
 *  参数 target 普通属性  target.prototype   静态属性 target 就是当前的类
 *  propertyKey 属性名称
 */

const userRoles: string[] = [];

const RoleDecorator = (roles: string[]) => (target: any, key: string) => {
    roles.forEach((role) => userRoles.push(role));
};
const exp4 = async () => {};

export { exp4 };
