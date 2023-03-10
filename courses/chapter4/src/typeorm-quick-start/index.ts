import { AppDataSource } from './config/database.config';
// import { photOperate } from './photOperate';
// import { treeOperate } from './treeOperate';
import { cascadeOperate } from './cascadeOperate';

const typeormDemo = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('typeorm🔗成功');
            // photOperate();
            // treeOperate();
            cascadeOperate();
        })
        .catch((error) => console.log(error));
};

export { typeormDemo };
