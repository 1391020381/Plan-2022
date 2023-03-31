import { ModuleBuilder } from '../core/decorators';

import { RestfulFactory } from './factory';

@ModuleBuilder(async (configure) => {
    const restful = new RestfulFactory(configure);
    await restful.create(await configure.get('api'));
    return {
        global: true,
        imports: restful.getModuleImports(),
        providers: [
            {
                provide: RestfulFactory,
                useValue: restful,
            },
        ],
        exports: [RestfulFactory],
    };
})
export class RestfulModule {}
