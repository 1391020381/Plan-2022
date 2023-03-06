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

# EntityRepository -> CustomRepository

```
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
↓

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

```

## 使用 Query Builder 查询

- Query Builder 是 TypeORM 最强大的功能之一,它允许使用优雅便捷的语法构建 SQL 查询,执行并获得自动转换的实体。

```
createQueryBuild('user') 相当于

createQueryBuilder().select('user').form(User,'user')


SELECT ... FROM users user

users 表名  user 别名
```

## EventSubscriber

- 将类标记为事件订阅者，该订阅者可以侦听特定实体事件或任何实体的事件。使用 QueryBuilder 和存储库/管理器方法触发事件
