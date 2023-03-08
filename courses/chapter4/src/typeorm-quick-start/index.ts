import { AppDataSource } from './config/database.config';

const typeormDemo = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('typeorm🔗成功');
        })
        .catch((error) => console.log(error));
};

export { typeormDemo };
