import { isNil } from 'lodash';

import { ConnectionOption, ConnectionRst } from '../types';

/**
 * 生成Typeorm,Redis等连接的配置
 * @param options
 */
export const createConnectionOptions = <T extends Record<string, any>>(
    options: ConnectionOption<T>,
): ConnectionRst<T> => {
    const config: ConnectionRst<T> = Array.isArray(options)
        ? options
        : [{ ...options, name: 'default' }];
    if (config.length <= 0) return undefined;
    if (isNil(config.find(({ name }) => name === 'default'))) {
        config[0].name = 'default';
    }
    return config.reduce((o, n) => {
        const names = o.map(({ name }) => name) as string[];
        return names.includes(n.name) ? o : [...o, n];
    }, []);
};
