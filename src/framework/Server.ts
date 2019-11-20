import WebSocket from "isomorphic-ws"
import uuid from "uuid/v4"
import { EventChannel } from "./EventChannel"
import { ClientMessage, ServerMessage } from "./types"

type ServerOptions<State> = {
  initialState: State
}

export class Server<State, IncomingMessage> {
  private server = this.createSocketServer()
  private state: State
  private clients = new Set<ServerClient<State>>()

  onConnect = new EventChannel<[ServerClient<State>]>()
  onDisconnect = new EventChannel<[ServerClient<State>]>()
  onMessage = new EventChannel<[ServerClient<State>, IncomingMessage]>()

  constructor(options: ServerOptions<State>) {
    this.state = options.initialState
  }

  setState(getNewState: (oldState: State) => State) {
    this.state = getNewState(this.state)
    this.broadcast({ type: "state", state: this.state })
  }

  private createSocketServer() {
    const server = new WebSocket.Server({ port: 3001 })

    server.on("connection", (socket) => {
      const client = new ServerClient(uuid(), socket)
      this.clients.add(client)
      this.onConnect.send(client)

      socket.on("message", (data) => {
        const message: ClientMessage<IncomingMessage> = JSON.parse(String(data))
        this.onMessage.send(client, message.message)
      })

      socket.on("close", () => {
        this.onDisconnect.send(client)
        this.clients.delete(client)
      })
    })

    server.on("listening", () => {
      console.info(
        `server listening on http://localhost:${server.options.port}`,
      )
    })

    return server
  }

  private broadcast(message: ServerMessage<State>) {
    for (const client of this.clients) {
      client.send(message)
    }
  }
}

class ServerClient<State> {
  constructor(public id: string, public socket: WebSocket) {}

  send(message: ServerMessage<State>) {
    this.socket.send(JSON.stringify(message))
  }
}
