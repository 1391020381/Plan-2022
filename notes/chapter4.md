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
