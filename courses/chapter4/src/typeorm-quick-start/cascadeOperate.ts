import { AppDataSource } from './config/database.config';

import { Question } from './entity/Question';

import { CascadeCategory } from './entity/CascadeCategory';

const cascadeOperate = async () => {
    const category1 = new CascadeCategory();
    category1.name = 'animals';

    const category2 = new CascadeCategory();
    category2.name = 'zoo';

    const question = new Question();
    question.title = '问题';
    question.text = '问题描述';
    question.categories = [category1, category2];

    await AppDataSource.manager.save(question);
    const questionRepository = AppDataSource.getRepository(Question);
    const questionData = await questionRepository.find({
        relations: {
            categories: true,
        },
    });
    console.log('questionData:', questionData, '----------', JSON.stringify(questionData));
};

export { cascadeOperate };
