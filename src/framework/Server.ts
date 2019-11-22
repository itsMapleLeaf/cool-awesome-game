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

export class Server<UserMessage> {
  private readonly server: FrameworkServer<UserMessage>
  private readonly clients = new Set<ServerClient<UserMessage>>()
  private readonly rooms = new Map<string, ServerRoom<UserMessage>>()

  readonly onConnect = new EventChannel<[ServerClient<UserMessage>]>()
  readonly onDisconnect = new EventChannel<[ServerClient<UserMessage>]>()
  readonly onMessage = new EventChannel<
    [ServerClient<UserMessage>, UserMessage]
  >()
  readonly onListening = new EventChannel()

  constructor(private readonly options: ServerOptions = defaultOptions) {
    this.server = this.createSocketServer()
  }

  createRoom<State>(options: ServerRoomOptions<State>) {
    this.log(chalk.green(`create room "${options.id}"`))

    const room = new ServerRoom<UserMessage, State>(options, this.server)
    this.rooms.set(room.id, room as any) // variance issue
    return room
  }

  private createSocketServer() {
    const server: FrameworkServer<UserMessage> = new TypedSocketServer({
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

  private handleClientMessage(
    client: ServerClient<UserMessage>,
    message: ClientMessage<UserMessage>,
  ) {
    if ("roomId" in message) {
      const room = this.rooms.get(message.roomId)
      // TODO: send back error if room doesn't exist
      room?.handleClientMessage(client, message)
      return
    }

    switch (message.type) {
      case "server-message":
        this.onMessage.send(client, message.message)
        break
    }
  }

  private log(...values: unknown[]) {
    if (!this.options.logging) return
    console.info(...values)
  }
}
