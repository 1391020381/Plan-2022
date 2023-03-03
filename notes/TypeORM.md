# 自定义装饰器

- https://docs.nestjs.com/custom-decorators

* Decorator composition

```

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;
}


```

- 如果要为 User 实体使用替代表名,可以在@Entity 中指定 @Entity("my_users")

* entities 和 repositories 含义和区别
* 实体是一个映射到数据库表(或使用 MondoDB)的类。 可以通过定义一个新类来创建一个实体并用 @Entity 来标记

* 使用 EntityManager 你可以管理(insert update delete load 等) 任何实体。EntityManager 就像放一个实体存储库的集合的地方。
* Repository 就像 EntityManager 一样，但其操作仅限于具体实体。

* TypeOrmModule.forFeature([User]) 此模块使用 forFeature() 方法定义在当前范围中注册哪些存储库。 这样，我们就可以使用 @InjectRepository 装饰器将 UsersRepository 注入到 UsersService 中
