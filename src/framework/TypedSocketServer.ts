import WebSocket, { ServerOptions } from "isomorphic-ws"
import { EventChannel } from "./EventChannel"
import { TypedSocket } from "./TypedSocket"

export class TypedSocketServer<IncomingMessage, OutgoingMessage> {
  private readonly clients = new Set<
    TypedSocket<IncomingMessage, OutgoingMessage>
  >()

  readonly onConnection = new EventChannel<
    [TypedSocket<IncomingMessage, OutgoingMessage>]
  >()
  readonly onListening = new EventChannel()

  constructor(public readonly options: ServerOptions) {
    const server = new WebSocket.Server(options)

    server.on("connection", (socket) => {
      const client = TypedSocket.fromSocket<IncomingMessage, OutgoingMessage>(
        socket,
      )
      this.clients.add(client)

      client.onClose.listen(() => {
        this.clients.delete(client)
      })

      this.onConnection.send(client)
    })

    server.on("listening", () => this.onListening.send())
  }

  broadcast(message: OutgoingMessage) {
    for (const client of this.clients) {
      client.send(message)
    }
  }
}
