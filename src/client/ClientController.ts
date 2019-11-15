import { createSocket } from "./createSocket"
import { sleep } from "./sleep"
import { ClientSocket } from "./types"

export class ClientContoller {
  private socket?: ClientSocket

  async connect() {
    while (!this.socket) {
      try {
        const socket = (this.socket = await createSocket("ws://localhost:3001"))

        // try to reconnect if we close
        socket.onClose(() => {
          // this _might_ cause a memory leak
          // i'm not sure if we can rely on listeners being removed when the socket gets GC'd,
          // but we'll cross that bridge when we get to it
          this.socket = undefined
          this.connect()
        })
      } catch {
        // failed? wait and try again
        await sleep(1000)
      }
    }
  }

  disconnect() {
    this.socket?.close()
  }

  move(direction: -1 | 1) {
    this.socket?.send({ type: "move", direction })
  }

  async joinNewGame() {
    const socket = this.assertConnected()
    const reply = await socket.request({ type: "new-room" })
    return reply.id
  }

  async joinGame(id: string) {
    // TODO
  }

  private assertConnected(): ClientSocket {
    if (!this.socket) {
      throw new Error("Socket not connected")
    }
    return this.socket
  }
}
