import { ExecutionContext, Injectable } from '@nestjs/common';

import { ModuleRef, Reflector } from '@nestjs/core';

import { isNil } from 'lodash';

import { ClassToPlain } from '@/modules/core/types';
import { UserEntity } from '@/modules/user/entities';
import { JwtWsGuard } from '@/modules/user/guards';

import { UserRepository } from '@/modules/user/repositories';
import { TokenService } from '@/modules/user/services';

import { RbacResolver } from '../rbac.resolver';

import { getCheckers, solveChecker } from './checker';

@Injectable()
export class RbacWsGuard extends JwtWsGuard {
    constructor(
        protected reflector: Reflector,
        protected resolver: RbacResolver,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
        protected moduleRef: ModuleRef,
    ) {
        super(tokenService);
    }

    /**
     * 守卫方法
     * @param context
     */
    async canActivate(context: ExecutionContext) {
        const result = await super.canActivate(context);
        if (!result) return false;
        const { token } = context.switchToWs().getData() || {};
        const accessToken = await this.tokenService.checkAccessToken(token);
        const tokenUser = (await this.tokenService.verifyAccessToken(
            accessToken,
        )) as ClassToPlain<UserEntity>;
        const checkers = getCheckers(context, this.reflector);
        if (isNil(checkers) || checkers.length <= 0) return true;
        const user = await this.userRepository.findOneOrFail({
            relations: ['roles.permissions', 'permissions'],
            where: {
                id: tokenUser.id,
            },
        });

        return solveChecker({
            resolver: this.resolver,
            checkers,
            moduleRef: this.moduleRef,
            user,
        });
    }
}
