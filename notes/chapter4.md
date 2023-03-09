- @JoinTable()需要指定这是关系的所有方

* @ManyToMany(type=>Photo,photo => photo.albums)

* OneToMany(type=>Photo,photo=>photo.author) OneToMany 总是反向的,并且总是与 ManyToOne 一起出现。
* 在多对一 一对多的关系中 拥有方总是多对一的。 这就意味着使用 @ManyToOne 的类将存储相关对象的 id。

# 数据库之间关系

## content_comments 评论

- @Exclude() 跳过类的所有属性 可以通过在类上添加@Exclude 装饰器并且在需要公开的属性上添加@Expose 装饰器来只公开指定的属性。

* @Entity('content_comments') 数据库名称 别名
* @Tree('materialized-path') 树形结构
* @TreeParent({onDelete:'CASCADE'})
* @TreeChildren({cascade:true})
* content_posts 文章
* content_posts_categories_content_categories
* content_categories 内容分类

# 关联实现

- 在定义反向关系的时候我们需要遵循以下规则

1. 多对多关联时,关联的一侧(比如这里的 PostEntity 的 categories 关系所有方) 必须加上 @JoinTable 装饰器
2. 一对多关联时(反向关联为多对一) 两侧都不需要加任何东西。
3. 一对一关联时 关联的一则必须要加上 @JoinColumn 装饰器

# 分类存储类

- 添加一个用于构建基础查询器的 buildBaseQB 用于在查询分类时把它关联的父分类也顺带查询进去
- 重载 findRoots createDescendantsQueryBuilder createAncestorsQueryBuilder 这样就可以在查询顶级分类, 子孙分类和祖先分类时,使用自定义的 customOrder 进行升序排序了。

```

const user = await createQueryBuilder("user")
  .leftJoinAndSelect("user.photos", "photo")
  .where("user.name = :name", { name: "Timber" })
  .getOne();


{
    id: 1,
    name: "Timber",
    photos: [{
        id: 1,
        url: "me-with-chakram.jpg"
    }, {
        id: 2,
        url: "me-with-trees.jpg"
    }]
}

```

- leftJoinAndSelect 自动加载了所有 Timber 的 photos。 第一个参数是你要加载的关系,第二个参数是你为此关系的表分配的别名。

* 分页

```

const users = await getRepository(User)
  .createQueryBuilder("user")
  .leftJoinAndSelect("user.photos", "photo")
  .skip(5)
  .take(10)
  .getMany();

```

- 将跳过前 5 个 users 并获取他们之后 10 个 user。

* take 和 skip 可能看起来像我们正在使用 limit 和 offset,但它们不是。一旦你有更复杂的链接或者子查询查询,limit 和 offset 可能无法正常工作。 使用 take 和 skip 可以防止这些问题。

```
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .relation(Post, "categories")
  .of(post)
  .add(category);


import { getManager } from "typeorm";

const postRepository = getRepository(Post);
const post = await postRepository.findOne(1, { relations: ["categories"] });
post.categories.push(category);
await postRepository.save(post);




```
