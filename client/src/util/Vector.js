export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add(v2) {
    return new Vector(
      this.x + v2.x,
      this.y + v2.y
    )
  }

  sub(v2) {
    return new Vector(
      this.x - v2.x,
      this.y - v2.y
    )
  }

  mul(v) {
    return new Vector(
      this.x * v,
      this.y * v
    )
  }

  div(v) {
    return new Vector(
      this.x / v,
      this.y / v
    )
  }

  rotate(angle) {
    return new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.y * Math.cos(angle) + this.x * Math.sin(angle)
    )
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  } 

  get unit() {
    return this.div(this.magnitude)
  }
}
