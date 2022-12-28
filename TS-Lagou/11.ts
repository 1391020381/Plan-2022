class Dog {
  public wang: string;
  constructor(wang) {
    this.wang = wang;
  }
}
class Cat {
  constructor() {}
}
const isDog = function (animal: Dog | Cat): animal is Dog {
  return "wang" in animal;
};

const getName = (animal: Dog | Cat) => {
  if (isDog(animal)) {
    return animal.wang;
  }
};
