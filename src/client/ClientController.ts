import { ServerMessage } from "../core/types"
import { createHttpClient } from "./createHttpClient"
import { createSocket } from "./createSocket"
import { sleep } from "./sleep"
import { ClientSocket } from "./types"

// TODO: use state machine (desperately needed)
export class ClientContoller {
  private socket?: ClientSocket
  private http = createHttpClient(`http://localhost:3002`)
  private clientId?: string

  async connect() {
    while (!this.socket) {
      try {
        const socket = (this.socket = await createSocket("ws://localhost:3001"))

        socket.onMessage((message) => {
          this.handleServerMessage(message)
        })

        // try to reconnect if we close
        socket.onClose(() => {
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

  async joinNewGame(): Promise<string> {
    const result = await this.http.request(
      `/create-room?clientId=${this.clientId}`,
      { method: "post" },
    )
    return result.data.roomId
  }

  async joinGame(roomId: string): Promise<void> {
    await this.http.request(
      `/join-room?clientId=${this.clientId}&roomId=${roomId}`,
      { method: "post" },
    )
  }

  private handleServerMessage(message: ServerMessage) {
    switch (message.type) {
      case "client-init": {
        this.clientId = message.clientId
        break
      }
      // etc.
    }
  }

  private assertConnected(): ClientSocket {
    if (!this.socket) {
      throw new Error("Socket not connected")
    }
    return this.socket
  }
}
