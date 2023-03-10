# 使用数据源 数据库连接

## 什么事 Connection

- 只有在建立连接后才能与数据库进行交互。TypeORM 的 Connection 不会像看起来那样设置单个数据库连接,而是设置连接池。

* 通常情况下,你只能在应用程序启动时创建一次连接,并在完全使用数据库后关闭它。实际上,如果要为站点构建后端,并且后端服务器始终保持运行,则不需要关闭连接。

## 创建新的连接

- 有多种方法可以创建连接。但是最简单和最常用的方法是使用 createConnection 和 createConnections 函数。

## 数据源选项

## 多个数据源

## 数据源 API

## 使用 ormconfig.json

## Connection 选项

1. mysql
2. mongodb

## 多个连接 数据库 模式 和 主从复制设置

```
import {createConnections} from "typeorm";

const connections = await createConnections([{
    name: "db1Connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db1",
    entities: [__dirname + "/entity/*{.js,.ts}"],
    synchronize: true
}, {
    name: "db2Connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db2",
    entities: [__dirname + "/entity/*{.js,.ts}"],
    synchronize: true
}]);

```

- 此方法允许连接已拥有的任意数量的数据库,每个数据库都有自己的配置,自己的实体和整体 ORM 范围和设置。

* 对于每个连接 将创建一个新的 Connection 实例
* 使用连接时,必须指定连接名称以获取特定连接

```
import {getConnection} from "typeorm";

const db1Connection = getConnection("db1Connection");
// 现在可以使用"db1"数据库...

const db2Connection = getConnection("db2Connection");
// 现在可以使用"db2"数据库...


```

## 在单个连接中使用多个数据库

```
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ database: "secondDB" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

}

import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ database: "thirdDB" })
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

}


```

- user 实体将在 secondDB 数据库内创建 Photo 实体则在 thirdDB 数据库内

* 如果要从其他数据库中选择数据,则只需提供一个实体

```
const users = await connection
    .createQueryBuilder()
    .select()
    .from(User, "user")
    .addFrom(Photo, "photo")
    .andWhere("photo.userId = user.id")
    .getMany(); // userId因其跨数据库请求而不是外键

```

- 对应代码生成以下 sql 查询(取决于数据库类型)

```
SELECT * FROM "secondDB"."question" "question", "thirdDB"."photo" "photo" WHERE "photo"."userId" = "user"."id"

```

## 主从复制

- 可以使用 TypeORM 设置读/写复制

* 复制连接设置示例

```

{
  type: "mysql",
  logging: true,
  replication: {
    master: {
      host: "server1",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    },
    slaves: [{
      host: "server2",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }, {
      host: "server3",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }]
  }
}


```

- 所有模式更新和写入操作都是用 master 服务器执行。
- find 方法 或 select query builder 执行的所有简单查询都是用随机 slave 实例

# Connecttion API

# 实体

- 实体时一个映射到数据库表(或使用 MongoDB 时的集合)的类
- 每个实体都必须在连接选项中注册

```
import { createConnection, Connection } from "typeorm";

const connection: Connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: ["entity/*.js"]
});

```

- @Entity() 可以指定一些其他实体选项

* name 表名 如果未指定 则从实体类名生成表名。
* database 所选 DB 服务器中的数据库名称
* schema 架构名称
* orderBy 使用 find 操作和 QueryBuilder 指定实体的默认排序。

## 实体列

1. @PrimaryColumn() 创建一个主列,它可以获取任何类型的任何值。你也可以指定列类型。如果未指定列类型,则将从属性类型自动推断。 必须在保存之前手动分配
2. @PrimaryGeneratedColumn() 创建一个主列,该值将使用自动增量值自动生成。它将使用 auto-increment /serial /sequence 创建 int 列（取决于数据库）。 你不必在保存之前手动分配其值，该值将会自动生成。
3. @PrimaryGeneratedColumn("uuid") 创建一个主列，该值将使用 uuid 自动生成。 Uuid 是一个独特的字符串 id。 你不必在保存之前手动分配其值，该值将自动生成。

## 特殊列

1. @CreateDateColumn 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置。
2. @UpdateDateColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时，自动更新实体日期。无需设置此列，该值将自动设置。
3. @VersionColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时自动增长实体版本（增量编号）。无需设置此列，该值将自动设置。

## 空间列

## 列类型

## 列选项

```

@Column({
    type: "varchar",
    length: 150,
    unique: true,
    // ...
})

```

1. type ColumnType 列类型
2. name: string 数据库表的列名
3. width
4. default
5. precision

# 实体继承

# 树实体

# 嵌入式实体

# 实体继承

## 具体表继承

## 单表继承

# 树实体

## 物化路径(又名路径枚举)

```
import {Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn} from "typeorm";

@Entity()
@Tree("materialized-path")
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;
}

## 使用树实体


```

# 视图实体

# 分离实体定义

# 什么是关系

- 关系可以帮助轻松与相关实体合作。
- 一对一 使用 @OnetoOne
- 多对一 使用 @ManyToOne
- 一对多 使用 @OneToMany
- 多对多 使用 @MnayToMany

## @JoinColumn 选项

- @JoinColumn 不仅定义了关系的哪一侧包含带有外建的连接列,还允许自定义连接列和引用的列名

## JoinTable 选项

- @JoinTable 用于 多对多 的关系 并描述 junction 表的连接列。联结表是由 TypeORM 自动创建的一个特殊的单独表,其中的列引用相关实体。 可以使用 @JoinColumn 更改联结表及其引用列的列名

## 一对一关系

- 启动级联后,只需要 一次 save 调用即可保存此关系。

* @JoinColumn 必须仅仅设置在关系的一侧且必须在数据库中具有外建的一侧。
* 双向关系

## 多对一 一对多的关系

## 多对多关系

# Eager 和 Lazy 关系

# 关系常见问题

# 什么是 EntityManager

- 使用 EntityManager 可以管理 (insert update delete load 等) 任何实体。 EntityManager 就像放一个实体存储库的集合的地方。

# 什么是 Repository

- Repository 就像 EntityManager 一样,但其操作仅限于具体实体

* 可以通过 getRepository(Entity)

* 有三种类型的存储库
* Repository 任何实体的常规存储库
* TreeRepository 用于树实体的 Repository 的扩展存储库
* MongoRepository - 具有特殊功能的存储库，仅用于 MongoDB。

# Find 选项

- 所有存储库和管理器 find 方法都接受可用于查询所需数据的特殊选项,而无需使用 QueryBuilder

* select 表示必须选择对象的哪些属性
* relations 关系需要加载主体
* join 需要为实体执行联接 扩展版对的 relations
* where 查询实体的简单条件

## 进阶选项

- TypeORM 提供了许多内置运算符,可用于创建更复杂的查询

1. Not
2. LessThan
3. LessThanOrEqual
4. MoreThan
5. MoreThanOrEqual
6. Equal
7. Like

# 自定义存储库

- 创建一个自定义存储库,其中应包含使用数据库的方法。
- 通常为单个实体创建自定义存储库,并包含其特定查询。

# EntityManager API

# Repository API

# 使用 Query Buidler

# Active Record 与 Data Mapper
