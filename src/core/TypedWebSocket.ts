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

  send(message: OutgoingMessage) {
    this.socket.send(JSON.stringify(message))
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

  onMessage(listener: (message: IncomingMessage) => void) {
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
