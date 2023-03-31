/**
 * 自定义用户模块配置
 */
export interface UserConfig {
    hash?: number;
    jwt: JwtConfig;
}

/**
 * JWT配置
 */
export interface JwtConfig {
    secret: string;
    token_expired: number;
    refresh_secret: string;
    refresh_token_expired: number;
}

/**
 * JWT荷载
 */
export interface JwtPayload {
    sub: string;
    iat: number;
}
