import { AppDataSource } from './config/database.config';

import { Category } from './entity/Category';

const treeOperate = async () => {
    const a1 = new Category();
    a1.name = 'a1';
    await AppDataSource.manager.save(a1);

    const a11 = new Category();
    a11.name = 'a11';
    a11.parent = a1;
    await AppDataSource.manager.save(a11);

    const a12 = new Category();
    a12.name = 'a12';
    await AppDataSource.manager.save(a12);

    const a111 = new Category();
    a111.name = 'a111';
    a11.parent = a111;
    await AppDataSource.manager.save(a111);

    const a112 = new Category();
    a112.name = 'a112';
    a112.parent = a11;
    await AppDataSource.manager.save(a112);
    const tress = await AppDataSource.getTreeRepository(Category).findTrees();
    console.log('trees:', tress);
};

export { treeOperate };
