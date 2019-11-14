import { ClientMessage } from "../core"
import { createSocket } from "./createSocket"
import { sleep } from "./sleep"

export class ClientContoller {
  private socket?: WebSocket

  async connect() {
    while (!this.socket) {
      try {
        const socket = (this.socket = await createSocket("ws://localhost:3001"))

        // try to reconnect if we close
        socket.addEventListener("close", () => {
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
    if (this.socket) this.socket.close()
  }

  move(direction: -1 | 1) {
    this.sendMessage({ type: "move", direction })
  }

  async joinNewGame() {
    // TODO
    return ""
  }

  async joinGame(id: string) {
    // TODO
  }

  private sendMessage(message: ClientMessage) {
    // TODO: use optional chaining
    if (this.socket) this.socket.send(JSON.stringify(message))
  }
}
