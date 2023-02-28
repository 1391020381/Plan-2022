function addFly(target) {
  target.prototype.isFly = true;
  target.isFly = true;
}

@addFly
class Man {
  name = '';
  constructor(name) {
    this.name = name;
  }
}
