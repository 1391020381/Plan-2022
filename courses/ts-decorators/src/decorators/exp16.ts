import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
function DefineType(type: Object) {
    return Reflect.metadata('design:type', type);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function DefineParamTypes(...types: Object[]) {
    return Reflect.metadata('design:paramtypes', types);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function DefineReturnType(type: Object) {
    return Reflect.metadata('design:returntype', type);
}

@DefineParamTypes(String, Number)
class Foo {
    @DefineType(String)
    get name() {
        return 'linbudu';
    }

    @DefineType('Function')
    @DefineParamTypes(Number, Number)
    @DefineReturnType(Number)
    add(source: number, input: number): number {
        return source + input;
    }
}

const exp16 = () => {
    const foo = new Foo();
    const paramTypes = Reflect.getMetadata('design:paramtypes', foo, 'add');
    const returnTypes = Reflect.getMetadata('design:returntype', foo, 'add');
    const type = Reflect.getMetadata('design:type', foo, 'name');
    console.log('exp16:', paramTypes, returnTypes, type);
};

export { exp16 };
