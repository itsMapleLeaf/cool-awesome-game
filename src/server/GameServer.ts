import Koa from "koa"
import bodyParser from "koa-bodyparser"
import route from "koa-route"
import WebSocket from "ws"
import { TypedWebSocket } from "../core/TypedWebSocket"
import { ClientMessage } from "../core/types"
import { Client } from "./Client"
import { Room } from "./Room"
import { ServerSocket } from "./types"

const socketPort = 3001
const httpPort = 3002

export class GameServer {
  private socketServer = this.createSocketServer()
  private httpServer = this.createHttpServer()
  private rooms = new Map<string, Room>()
  private clients = new Map<string, Client>()

  private createRoom(clientId: string) {
    const client = this.clients.get(clientId)
    if (!client) {
      // TODO: make custom error class and use that
      throw new Error("Invalid clientId")
    }

    const room = new Room()
    this.rooms.set(room.id, room)
    client.roomId = room.id
    return room.id
  }

  private joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId)
    if (!client) {
      // TODO: make custom error class and use that
      throw new Error("Invalid clientId")
    }

    const room = this.rooms.get(roomId)
    if (!room) {
      // TODO: make custom error class and use that
      throw new Error("Invalid roomId")
    }

    client.roomId = roomId
  }

  private handleClientMessage(message: ClientMessage, client: Client) {
    // dunno lol
  }

  private handleSocketConnection(socket: ServerSocket) {
    const client = new Client(socket)
    this.clients.set(client.id, client)
    client.sendClientInit()

    console.info(`new client: ${client.id}`)

    socket.onMessage((message) => {
      this.handleClientMessage(message, client)
    })

    socket.onClose(() => {
      console.info(`disconnected: ${client.id}`)
    })
  }

  private createSocketServer() {
    const server = new WebSocket.Server({ port: socketPort })

    server.on("connection", (socket) => {
      this.handleSocketConnection(new TypedWebSocket(socket))
    })

    server.on("listening", () => {
      console.info(
        `socket listening on http://localhost:${server.options.port}`,
      )
    })

    return server
  }

  private createHttpServer() {
    const server = new Koa()

    server.use(async (ctx, next) => {
      try {
        await next()
      } catch (error) {
        ctx.status = 500
        ctx.body = { error: { message: "Internal server error" } }
      }
    })

    server.use(bodyParser())

    server.use(
      route.post("/create-room", async (ctx) => {
        const roomId = this.createRoom(String(ctx.query.clientId))
        ctx.body = { data: { roomId } }
      }),
    )

    server.use(
      route.post("/join-room", async (ctx) => {
        const { clientId, roomId } = ctx.query
        this.joinRoom(String(clientId), String(roomId))
        ctx.body = {}
      }),
    )

    server.listen(httpPort, () => {
      console.info(`http listening on http://localhost:${httpPort}`)
    })

    return server
  }
}
