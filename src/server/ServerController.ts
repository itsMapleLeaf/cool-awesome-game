import uuid from "uuid/v4"
import WebSocket from "ws"
import { ClientMessage } from "../core/types"

export class GameServer {
  private server = new WebSocket.Server({ port: 3001 })
  private clients = new Map<string, Client>()
  private games = new Map<string, Game>()

  constructor() {
    this.server.on("connection", (socket) => {
      const client = new Client(socket)
      this.clients.set(client.id, client)
      console.info(`new client: ${client.id}`)

      socket.on("message", (data) => {
        this.handleClientMessage(JSON.parse(String(data)), client)
      })

      socket.on("close", () => {
        console.info(`disconnected: ${client.id}`)
      })
    })

    this.server.on("listening", () => {
      console.info(`listening on http://localhost:${this.server.options.port}`)
    })
  }

  handleClientMessage(message: ClientMessage, client: Client) {
    switch (message.type) {
      case "new-room": {
        const game = new Game()
        this.games.set(game.id, game)
        break
      }
    }
  }
}

class Client {
  readonly id = uuid()
  constructor(private readonly socket: WebSocket) {}
}

class Game {
  readonly id = uuid()
  readonly players: string[] = []
}
