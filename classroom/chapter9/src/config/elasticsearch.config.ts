import { CoreOptions } from '@/modules/core/types';

export const es: CoreOptions['es'] = () => ({
    node: 'http://localhost:9200',
    maxRetries: 10,
    requestTimeout: 60000,
    pingTimeout: 60000,
    sniffOnStart: true,
});
