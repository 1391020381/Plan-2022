import { EnvironmentType } from '@/modules/core/constants';
import { getRunEnv } from '@/modules/core/helpers';
import { UserConfig } from '@/modules/user/types';

const expiredTime = getRunEnv() === EnvironmentType.DEVELOPMENT ? 3600 * 10000 : 3600;

/**
 * 用户模块配置
 */
export const userConfig: () => UserConfig = () => ({
    hash: 10,
    jwt: {
        secret: 'my-secret',
        token_expired: expiredTime,
        refresh_secret: 'my-refresh-secret',
        refresh_token_expired: expiredTime * 30,
    },
});
