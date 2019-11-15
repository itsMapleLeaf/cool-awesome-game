import uuid from "uuid/v4"

export class Game {
  readonly id = uuid()
  readonly players: string[] = []
}
