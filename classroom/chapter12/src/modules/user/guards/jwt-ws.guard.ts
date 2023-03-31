import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isNil } from 'lodash';

import { TokenService } from '../services/token.service';

/**
 * 用于WebSocket的用户JWT认证守卫,检测用户是否已登录
 */
@Injectable()
export class JwtWsGuard implements CanActivate {
    constructor(protected tokenService: TokenService) {}

    /**
     * 守卫方法
     * @param context
     */
    async canActivate(context: ExecutionContext) {
        const { token } = context.switchToWs().getData() || {};
        if (!token) {
            throw new WsException('Missing access token');
        }
        // 判断token是否存在,如果不存在则认证失败
        const accessToken = await this.tokenService.checkAccessToken(token);
        if (!accessToken) throw new WsException('Access token incorrect');
        const user = await this.tokenService.verifyAccessToken(accessToken);
        return !isNil(user);
    }
}
