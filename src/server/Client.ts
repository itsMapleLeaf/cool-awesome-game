import uuid from "uuid/v4"
import { ServerSocket } from "./types"

export class Client {
  readonly id = uuid()
  constructor(private readonly socket: ServerSocket) {}
}
