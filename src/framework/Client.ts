import { sleep } from "../common/sleep"
import { ClientRoom } from "./ClientRoom"
import { EventChannel } from "./EventChannel"
import { TypedSocket } from "./TypedSocket"
import { FrameworkClientSocket, ServerMessage } from "./types"

type ClientStatus = "offline" | "connecting" | "online"

export class Client<UserMessage> {
  private socket?: FrameworkClientSocket<UserMessage>
  private status: ClientStatus = "offline"
  private readonly rooms = new Map<string, ClientRoom>()

  readonly onConnected = new EventChannel()
  readonly onDisconnected = new EventChannel()
  readonly onMessage = new EventChannel<[UserMessage]>()

  connect(url: string) {
    if (this.status !== "offline") return
    this.status = "connecting"

    const socket = (this.socket = TypedSocket.fromUrl(url))

    socket.onOpen.listen(() => {
      this.status = "online"
      this.onConnected.send()
    })

    socket.onClose.listen(async () => {
      this.status = "offline"
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    })

    socket.onError.listen(async () => {
      this.status = "offline"
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    })

    socket.onMessage.listen((message) => {
      this.handleServerMessage(message)
    })
  }

  disconnect() {
    this.socket?.removeListeners()
    this.socket?.disconnect()
    this.onConnected.clear()
    this.onDisconnected.clear()
  }

  joinRoom<State>(id: string) {
    if (!this.socket) {
      throw new Error("Attempted to join room before connecting")
    }

    this.socket.send({ type: "join-room", roomId: id })

    const room = new ClientRoom<UserMessage, State>({ id }, this.socket as any) // variance issue
    this.rooms.set(id, room as any) // variance issue
    return room
  }

  leaveRoom(roomId: string) {
    this.socket?.send({ type: "leave-room", roomId })
  }

  private handleServerMessage(message: ServerMessage<UserMessage>) {
    if ("roomId" in message) {
      const room = this.rooms.get(message.roomId)
      room?.handleServerMessage(message)

      if (message.type === "left-room") {
        this.rooms.delete(message.roomId)
      }

      return
    }

    switch (message.type) {
      case "client-message":
        this.onMessage.send(message.message)
        break
    }
  }
}
