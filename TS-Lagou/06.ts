class Son {
  public firstName: string;
  protected lastName: string = "Stark";
  constructor(firstName: string) {
    this.firstName = firstName;
  }
}
class GrandSon extends Son {
  constructor(firstName: string) {
    super(firstName);
  }
  get myLastName() {
    return this.lastName;
  }
  set myLastName(name: string) {
    if (this.firstName === "Tony") {
      this.lastName = name;
    } else {
      console.error("Unable to change myLastName");
    }
  }
}

const grandSon = new GrandSon("Tony");
console.log(grandSon.myLastName);
grandSon.myLastName = "Rogers";
console.log(grandSon.myLastName);

// extends 抽象类
// implements 实现 interface
