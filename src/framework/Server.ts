import WebSocket from "isomorphic-ws"
import uuid from "uuid/v4"
import { EventChannel } from "./EventChannel"
import { ServerClient } from "./ServerClient"
import { ServerRoom, ServerRoomOptions } from "./ServerRoom"
import { ClientMessage, ServerMessage } from "./types"

export class Server {
  private readonly clients = new Set<ServerClient>()
  private readonly rooms = new Map<string, ServerRoom>()

  readonly onConnect = new EventChannel<[ServerClient]>()
  readonly onDisconnect = new EventChannel<[ServerClient]>()

  constructor() {
    this.createSocketServer()
  }

  createRoom<State, IncomingMessage>(options: ServerRoomOptions<State>) {
    // passing "this" is an anti-pattern and breaks encapsulation
    // TODO: create a simple wrapper around the websocket server and pass that instead
    const room = new ServerRoom<State, IncomingMessage>(options, this)
    this.rooms.set(room.id, room as any) // variance issue
    return room
  }

  private createSocketServer() {
    const server = new WebSocket.Server({ port: 3001 })

    server.on("connection", (socket) => {
      const client = new ServerClient(uuid(), socket)
      this.clients.add(client)
      this.onConnect.send(client)

      socket.on("message", (data) => {
        this.handleClientMessage(client, JSON.parse(String(data)))
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

  private handleClientMessage(client: ServerClient, message: ClientMessage) {
    switch (message.type) {
      case "join-room": {
        const room = this.rooms.get(message.roomId)
        room?.addClient(client)
        break
      }

      case "leave-room": {
        // TODO
        break
      }

      case "room-client-message": {
        // TODO
        break
      }
    }
  }

  private broadcast(message: ServerMessage) {
    for (const client of this.clients) {
      client.send(message)
    }
  }
}
