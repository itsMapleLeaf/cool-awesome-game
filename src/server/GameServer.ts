import WebSocket from "ws"
import { TypedWebSocket } from "../core/TypedWebSocket"
import { ClientMessage } from "../core/types"
import { Client } from "./Client"
import { Game } from "./Game"
import { ServerSocket } from "./types"

export class GameServer {
  private server = new WebSocket.Server({ port: 3001 })
  private clients = new Map<string, Client>()
  private games = new Map<string, Game>()

  constructor() {
    this.server.on("connection", (baseSocket) => {
      const socket: ServerSocket = new TypedWebSocket(baseSocket)

      const client = new Client(socket)
      this.clients.set(client.id, client)
      console.info(`new client: ${client.id}`)

      socket.onMessage((message) => {
        this.handleClientMessage(message, client)
      })

      socket.onClose(() => {
        console.info(`disconnected: ${client.id}`)
      })
    })

    this.server.on("listening", () => {
      console.info(`listening on http://localhost:${this.server.options.port}`)
    })
  }

  handleClientMessage(
    message: ClientMessage & { id?: string },
    client: Client,
  ) {
    switch (message.type) {
      case "new-room": {
        const game = new Game()
        this.games.set(game.id, game)
        client.socket.send({ type: "new-room", roomId: game.id }, message.id)
        break
      }

      case "join-room": {
        const game = this.games.get(message.roomId)
        if (game) {
          game.players.push(client)
        } else {
          // reply with some error?
        }
        break
      }
    }
    console.log(this.games)
  }
}
