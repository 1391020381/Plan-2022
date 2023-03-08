import { AppDataSource } from './config/database.config';
import { photOperate } from './photOperate';

const typeormDemo = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('typeorm🔗成功');
            photOperate();
        })
        .catch((error) => console.log(error));
};

export { typeormDemo };
