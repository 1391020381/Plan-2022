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

* @OneToOne 的新装饰器,它允许我们在两个实体之间创建一对一的关系。
* type=> Photo 是一个函数 ,返回我们想要与之建立关系的实体类。
* 由于特定语言的关系,我们只能用一个返回类的函数,而不是直接使用该类。同时也可以把它写成 ()=> Photo 但是 type => Photo 显得代码更有可读性。 type 变量本身不包含任何内容。
* @JoinColumn 装饰器 表明实体键的对应关系。 关系可以是单向的或双向的。但是只有一方是拥有者。在关系所有者方面需要使用 @JoinColumn 装饰器

* phots => photo.metadata is a function that returns the name of the inverse side of the relation.
* Here we show that the metadata property of the Photo class is where we store PhotoMetadata in the Photo class.

# 一对一关系

- Photo PhotoMetadata

* 在关系拥有的一方 PhotoMetadata 通过 @JoinColumn() 来创建字段
* 在关系拥有的一方 通过 @OneToOne （type）=> Photo 来告知要关联的对象 （photo) => photo.metadata 在双向关系里面 告知 photo 中的 metadata 字段来保存 PhotoMetadata 数据

* 在 Photo 中 通过 @OneToOne (type)=> PhotoMetadata 来告知需要创建关联关系的实体 (photoMetadata) => photoMetadata.photo 告知 photoMetadata 中 photo 字段来保存 Photo 数据 且不用 @JoinColumn()

# 自定义存储库

- 你可以创建一个自定义存储库,其中应包含使用数据库的方法。

* 通常为单个实体创建自定义存储库,并包含其特定查询。
* 这个方法的最好的地方是在 Repository，所以我们可以这样称呼它 userRepository.findByName（...）

# 树实体

- 物化路径(也称为路径枚举) 是在数据库中存储树结构的另一种模式。简单有效
