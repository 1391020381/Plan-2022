* [TypeORM](https://typeorm.biunav.com/zh/#%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%A8%A1%E5%9E%8B)
* 支持MySQL MongoDB

* 使用数据库从创建表开始。如何告诉TypeORM创建数据库表。 答案是 通过模型应用程序中的模型即是数据库中的表
* 要在数据库中存储内容,首先需要一个数据库表,并从模型中创建数据库表。但是并非所有模型,只有你定义为 entities模型。

* Entity是由 @Entity装饰器装饰的模型。 将为此类模型创建数据库表。
* 你可以使用TypeORM处理各处实体,可以使用它们 load/insert/update/remove/并执行其他操作。


* 要使用其他数据库,只需要将选项中的 type更改为希望使用的数据库类型
* 设置synchronize可确保每次运行应用程序时实体都将与数据库同步。
