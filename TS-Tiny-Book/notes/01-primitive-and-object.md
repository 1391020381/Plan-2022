* 在 js中,null与 undefined 分别表示 这里有值 但是个空值 和这里没有值。
* 在TS中 null 与 undefined 类型都是 有具体意义的类型。也就是说 它们作为类型时,表示的是一个有意义的具体类型值。 这两者在没有开启strictNullChecks 检查的情况下,会被视作其他类型子类型,比如string类型会被认为包含了 null 与 undefined类型。
* void 用于描述 一个内部没有 return语句,或者没有显示 return一个值的函数的返回值。


* type 与 interface 
* interface 用来描述对象 类的结构
* 而类型别名用来将一个函数签名 一组联合类型 一个工具类型等等抽离成一个完整独立的类型。

# object Object {}
* 在 TS中就表现为Object包含了所有类型。
* object 的引入就是为了 解决对 Object类型的错误使用,它代表所有非原始类型的类型, 即 数组 对象 函数类型这些；