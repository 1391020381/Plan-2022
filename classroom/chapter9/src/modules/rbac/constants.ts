export enum RouteMethodType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

export const PERMISSION_CHECKERS = 'permission_checkers';

export enum PermissionAction {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage',
    OWNER = 'onwer',
}

export enum SystemRoles {
    USER = 'custom-user',
    ADMIN = 'super-admin',
}
