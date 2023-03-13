# keyof

- keyof 与 Object.keys 有些相似，只不过 keyof 取 interface 的键

```

interface Point {
    x:number;
    y:number
}

// 相当于
// type keys = "x" | "y"
type keys = keyof Point;

```

- Record
- 以 typeof 格式快捷创建一个类型,此类型包含一组指定的属性且都是必填。

```
type Coord = Record<'x' | 'y',number>

// 等同于

type Coord = {
    x:number;
    y:number;
}

```

- Partial
- 将类型定义的所有属性都修改为可选。

```
type Coord  = Partial<Record<'x' | 'y',number>>

// 等同于

type Corrd = {
    x?:number;
    y?:number;
}

```

- Readonly
- 将所有属性定义为只读。

```
type Coord = Readonly<Record<'x','y',number>>;

// 等同于
type Coord = {
    readonly x: number;
    readonly y: number;
}

```

- Pick
- 从类型定义的属性中,选取指定一组属性,返回一个新的类型定义

```
type Coord = Record<'x'|'y',number>;
type CoordX = Pick<Coord,'x'>

// 等用于

type Coordx = {
    x:number;
}
```
