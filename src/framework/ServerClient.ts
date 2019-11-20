import WebSocket from "isomorphic-ws"
import { ServerMessage } from "./types"

export class ServerClient {
  constructor(public id: string, public socket: WebSocket) {}

  send(message: ServerMessage) {
    this.socket.send(JSON.stringify(message))
  }
}
