# database

-   数据库自定义方法

## 自定义装饰器 decorators

-   SetMetadata 给某个参数添加 信息

```

/**
 * 自定义Repository
 * @param entity 关联的模型
 */
export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
    SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);


```

## 自定义数据库模块
