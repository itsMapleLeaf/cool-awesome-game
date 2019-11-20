import uuid from "uuid/v4"
import { EventChannel } from "./EventChannel"
import { ServerClient } from "./ServerClient"
import { ServerRoom, ServerRoomOptions } from "./ServerRoom"
import { TypedSocketServer } from "./TypedSocketServer"
import { ClientMessage, FrameworkServer } from "./types"

export class Server {
  private readonly server: FrameworkServer
  private readonly clients = new Set<ServerClient>()
  private readonly rooms = new Map<string, ServerRoom>()

  readonly onConnect = new EventChannel<[ServerClient]>()
  readonly onDisconnect = new EventChannel<[ServerClient]>()

  constructor() {
    this.server = this.createSocketServer()
  }

  createRoom<State, IncomingMessage>(options: ServerRoomOptions<State>) {
    const room = new ServerRoom<State, IncomingMessage>(options, this.server)
    this.rooms.set(room.id, room as any) // variance issue
    return room
  }

  private createSocketServer() {
    const server: FrameworkServer = new TypedSocketServer({
      port: 3001,
    })

    server.onConnection.listen((socket) => {
      const client = new ServerClient(uuid(), socket)
      this.clients.add(client)
      this.onConnect.send(client)

      socket.onMessage.listen((message) => {
        this.handleClientMessage(client, message)
      })

      socket.onClose.listen(() => {
        for (const [, room] of this.rooms) {
          room.removeClient(client.id)
        }
        this.clients.delete(client)
        this.onDisconnect.send(client)
      })
    })

    server.onListening.listen(() => {
      console.info(
        `server listening on http://localhost:${server.options.port}`,
      )
    })

    return server
  }

  private handleClientMessage(client: ServerClient, message: ClientMessage) {
    if ("roomId" in message) {
      const room = this.rooms.get(message.roomId)
      // TODO: send back error if room doesn't exist
      room?.handleClientMessage(client, message)
    }
  }
}
