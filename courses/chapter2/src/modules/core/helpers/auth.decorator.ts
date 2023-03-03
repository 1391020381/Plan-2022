import { applyDecorators, SetMetadata } from '@nestjs/common';

export function Auth(...roles: any[]) {
    return applyDecorators(SetMetadata('roles', roles));
}
