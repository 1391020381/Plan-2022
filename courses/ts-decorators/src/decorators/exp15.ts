import 'reflect-metadata';

// @Reflect.metadata('class:key', 'METADATA_IN_CLASS')
// class Foo {
//     @Reflect.metadata('prop:key', 'METADATA_IN_PROPERTY')
//     public prop: string = 'linbudu';

//     @Reflect.metadata('method:key', 'METADATA_IN_METHOD')
//     public handler(): void {}
// }
@Reflect.metadata('class:key', 'METADATA_IN_CLASS')
class Foo {
    @Reflect.metadata('prop:key', 'METADATA_IN_PROPERTY')
    public prop = 'linbudu';

    @Reflect.metadata('method:key', 'METADATA_IN_METHOD')
    public handler(): void {}
}
// Reflect.defineMetadata('class:key', 'class metadata', Foo);
// Reflect.defineMetadata('method:key', 'handler metadata', Foo, 'handler');
// Reflect.defineMetadata('proto:method:key', 'proto handler metadata', Foo.prototype, 'handler');

const exp15 = () => {
    console.log(Reflect.getMetadataKeys(Foo));
    console.log(Reflect.getMetadataKeys(Foo, 'handler'));
    console.log(Reflect.getMetadataKeys(Foo.prototype, 'handler'));
    console.log(Reflect.getMetadata('class:key', Foo));
    console.log(Reflect.getMetadata('method:key', Foo, 'handler'));
    console.log(Reflect.getMetadata('proto:method:key', Foo.prototype, 'handler'));
};

export { exp15 };
