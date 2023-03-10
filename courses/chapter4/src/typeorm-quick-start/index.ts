import { AppDataSource } from './config/database.config';
// import { photOperate } from './photOperate';
import { treeOperate } from './treeOperate';

const typeormDemo = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('typeorm🔗成功');
            // photOperate();
            treeOperate();
        })
        .catch((error) => console.log(error));
};

export { typeormDemo };
