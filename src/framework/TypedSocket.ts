import WebSocket from "isomorphic-ws"

type WebSocketLike = {
  send(data: any): void

  addEventListener(event: "open", listener: () => void): void
  addEventListener(event: "close", listener: () => void): void
  addEventListener(event: "error", listener: () => void): void
  addEventListener(
    event: "message",
    listener: (event: { data: any }) => void,
  ): void

  removeEventListener(event: "open", listener: () => void): void
  removeEventListener(event: "close", listener: () => void): void
  removeEventListener(event: "error", listener: () => void): void
  removeEventListener(
    event: "message",
    listener: (event: { data: any }) => void,
  ): void

  removeAllListeners(): void

  close(): void
}

type TypedSocketEvent<IncomingMessage> =
  | { type: "error" }
  | { type: "open" }
  | { type: "message"; message: IncomingMessage }
  | { type: "close" }

export class TypedSocket<OutgoingMessage, IncomingMessage> {
  private constructor(private socket: WebSocketLike) {}

  static fromSocket<OM, IM>(socket: WebSocketLike) {
    return new TypedSocket<OM, IM>(socket)
  }

  static fromUrl<OM, IM>(url: string) {
    return new TypedSocket<OM, IM>(new WebSocket(url))
  }

  send(message: OutgoingMessage) {
    this.socket.send(JSON.stringify(message))
  }

  close() {
    this.socket.close()
  }

  async *events() {
    const getNextSocketEvent = () =>
      new Promise<TypedSocketEvent<IncomingMessage>>((resolve) => {
        this.socket.addEventListener("open", () => {
          resolve({ type: "open" })
          this.socket.removeAllListeners()
        })

        this.socket.addEventListener("close", () => {
          resolve({ type: "close" })
          this.socket.removeAllListeners()
        })

        this.socket.addEventListener("message", ({ data }) => {
          resolve({ type: "message", message: JSON.parse(data) })
          this.socket.removeAllListeners()
        })

        this.socket.addEventListener("error", () => {
          resolve({ type: "error" })
          this.socket.removeAllListeners()
        })
      })

    let event
    do {
      event = await getNextSocketEvent()
      yield event
    } while (event.type !== "error" && event.type !== "close")
  }
}
