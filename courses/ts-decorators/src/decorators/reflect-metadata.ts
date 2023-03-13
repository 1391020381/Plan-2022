import 'reflect-metadata';

@Reflect.metadata('inClass', 'A')
class Test {
    @Reflect.metadata('inMethod', 'B')
    public hello(): string {
        return 'hello world';
    }
}

const reflectMetadata = async () => {
    console.log(Reflect.getMetadata('inClass', Test));
    console.log(Reflect.getMetadata('inMethhod', new Test()));
};

export { reflectMetadata };
