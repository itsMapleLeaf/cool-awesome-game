import uuid from "uuid/v4"

type WebSocket = {
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

  close(): void
}

export class TypedWebSocket<OutgoingMessage, IncomingMessage> {
  constructor(private socket: WebSocket) {}

  send(message: OutgoingMessage, id = uuid()) {
    this.socket.send(JSON.stringify({ ...message, id }))
    return id
  }

  request(message: OutgoingMessage) {
    const id = this.send(message)

    return new Promise<IncomingMessage>((resolve, reject) => {
      const unlisten = this.onMessage((message) => {
        if (message.id === id) {
          resolve(message)
          unlisten()
        }
      })

      setTimeout(() => {
        reject(new Error("Request timed out"))
        unlisten()
      }, 10000) // probably make this a constant
    })
  }

  onOpen(listener: () => void) {
    this.socket.addEventListener("open", listener)
    return () => this.socket.removeEventListener("open", listener)
  }

  onClose(listener: () => void) {
    this.socket.addEventListener("close", listener)
    return () => this.socket.removeEventListener("close", listener)
  }

  onError(listener: () => void) {
    this.socket.addEventListener("error", listener)
    return () => this.socket.removeEventListener("error", listener)
  }

  onMessage(listener: (message: IncomingMessage & { id?: string }) => void) {
    const wrappedListener = ({ data }: { data: unknown }) => {
      listener(JSON.parse(String(data)))
    }

    this.socket.addEventListener("message", wrappedListener)
    return () => this.socket.removeEventListener("message", wrappedListener)
  }

  close() {
    this.socket.close()
  }
}
