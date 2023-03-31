/**
 * 属性装饰器
 */

const userRoles: string[] = [];

// 通过属性装饰器把角色赋值给userRoles
const RoleDecorator = (roles: string[]) => (target: any, key: string) => {
    roles.forEach((role) => userRoles.push(role));
};
const roles = [
    { name: 'super-admin', desc: '超级管理员' },
    { name: 'admin', desc: '管理员' },
    { name: 'user', desc: '普通用户' },
];
// 根据userRoles生成Roles对象并赋值给类原型的roles属性
const SetRoleDecorator = <T extends new (...args: any[]) => any>(constructor: T) => {
    return class extends constructor {
        constructor(...args: any) {
            super(...args);
            this.roles = roles.filter((role) => userRoles.includes(role.name));
        }
    };
};

@SetRoleDecorator
class UserEntity {
    @RoleDecorator(['admin', 'user'])
    roles: { name: string; desc: string }[] = [];
}

export const exp5 = () => {
    console.log();
    console.log('-----------------------示例5:属性装饰器-----------------------');
    console.log('-----------------------使用装饰器设置roles权限列表-----------------------');
    console.log();
    const user = new UserEntity();
    console.log(user.roles);
    console.log();
    console.log('-----------------------示例5:执行完毕-----------------------');
};
