import uuid from "uuid/v4"
import { Client } from "./Client"

export class Game {
  readonly id = uuid()
  readonly players: Client[] = []
}
