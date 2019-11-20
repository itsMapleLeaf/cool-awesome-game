import WebSocket from "isomorphic-ws"
import { sleep } from "../common/sleep"
import { ClientRoom } from "./ClientRoom"
import { EventChannel } from "./EventChannel"
import { ClientMessage, ServerMessage } from "./types"

type ClientStatus = "offline" | "connecting" | "online"

export class Client {
  private socket?: WebSocket
  private status: ClientStatus = "offline"
  private rooms = new Map<string, ClientRoom>()

  readonly onConnected = new EventChannel()
  readonly onDisconnected = new EventChannel()

  connect(url: string) {
    if (this.status !== "offline") return
    this.status = "connecting"

    const socket = (this.socket = new WebSocket(url))

    socket.onopen = () => {
      this.status = "online"
      this.onConnected.send()
    }

    socket.onclose = async () => {
      this.status = "offline"
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    }

    socket.onerror = async () => {
      this.status = "offline"
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    }

    socket.onmessage = ({ data }) => {
      this.handleServerMessage(JSON.parse(String(data)))
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.onopen = () => {}
      this.socket.onclose = () => {}
      this.socket.onmessage = () => {}
      this.socket.onerror = () => {}
      this.socket.close()
    }

    this.onConnected.clear()
    this.onDisconnected.clear()
  }

  joinRoom<State, OutgoingMessage>(id: string) {
    this.send({ type: "join-room", roomId: id })

    // TODO: pass socket wrapper instead of "this"
    const room = new ClientRoom<State, OutgoingMessage>({ id }, this)
    this.rooms.set(id, room as any) // variance issue
    return room
  }

  send(data: ClientMessage) {
    this.socket?.send(JSON.stringify(data))
  }

  private handleServerMessage(message: ServerMessage) {
    if ("roomId" in message) {
      const room = this.rooms.get(message.roomId)
      room?.handleServerMessage(message)

      if (message.type === "left-room") {
        this.rooms.delete(message.roomId)
      }
    }
  }
}
