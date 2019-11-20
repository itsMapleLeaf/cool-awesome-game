import chalk from "chalk"
import uuid from "uuid/v4"
import { EventChannel } from "./EventChannel"
import { ServerClient } from "./ServerClient"
import { ServerRoom, ServerRoomOptions } from "./ServerRoom"
import { TypedSocketServer } from "./TypedSocketServer"
import { ClientMessage, FrameworkServer } from "./types"

type ServerOptions = {
  logging?: boolean
}

const defaultOptions: ServerOptions = {
  logging: true,
}

export class Server {
  private readonly server: FrameworkServer
  private readonly clients = new Set<ServerClient>()
  private readonly rooms = new Map<string, ServerRoom>()

  readonly onConnect = new EventChannel<[ServerClient]>()
  readonly onDisconnect = new EventChannel<[ServerClient]>()
  readonly onListening = new EventChannel()

  constructor(private readonly options: ServerOptions = defaultOptions) {
    this.server = this.createSocketServer()
  }

  createRoom<State, IncomingMessage>(options: ServerRoomOptions<State>) {
    this.log(chalk.green(`create room "${options.id}"`))

    const room = new ServerRoom<State, IncomingMessage>(options, this.server)
    this.rooms.set(room.id, room as any) // variance issue
    return room
  }

  private createSocketServer() {
    const server: FrameworkServer = new TypedSocketServer({
      port: 3001,
    })

    server.onConnection.listen((socket) => {
      const id = uuid()
      this.log(chalk.green(`new client ${id}`))

      const client = new ServerClient(id, socket)
      this.clients.add(client)
      this.onConnect.send(client)

      socket.onMessage.listen((message) => {
        // this.log(chalk.blue(`message from ${id}`), JSON.stringify(message))
        this.handleClientMessage(client, message)
      })

      socket.onClose.listen(() => {
        this.log(chalk.red(`disconnect ${id}`))
        for (const [, room] of this.rooms) {
          room.removeClient(client.id)
        }
        this.clients.delete(client)
        this.onDisconnect.send(client)
      })
    })

    server.onListening.listen(() => {
      this.log(
        chalk.blue(`listening on http://localhost:${server.options.port}`),
      )
      this.onListening.send()
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

  private log(...values: unknown[]) {
    if (!this.options.logging) return
    console.info(...values)
  }
}
