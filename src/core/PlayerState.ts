import { Schema, type } from "@colyseus/schema"

export class PlayerState extends Schema {
  @type("number") position = 0

  move(delta: number) {
    this.position += delta
  }
}
