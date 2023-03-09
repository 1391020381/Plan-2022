- @JoinTable()需要指定这是关系的所有方

* @ManyToMany(type=>Photo,photo => photo.albums)

* OneToMany(type=>Photo,photo=>photo.author) OneToMany 总是反向的,并且总是与 ManyToOne 一起出现。
* 在多对一 一对多的关系中 拥有方总是多对一的。 这就意味着使用 @ManyToOne 的类将存储相关对象的 id。
