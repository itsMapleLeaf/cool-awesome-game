import uuid from "uuid/v4"
import { ServerSocket } from "./types"

export class Client {
  readonly id = uuid()
  roomId?: string

  constructor(public readonly socket: ServerSocket) {}

  sendClientInit() {
    this.socket.send({ type: "client-init", clientId: this.id })
  }
}
