import WebSocket from "isomorphic-ws"
import { EventChannel } from "./EventChannel"

export class TypedSocket<IncomingMessage, OutgoingMessage> {
  readonly onOpen = new EventChannel()
  readonly onClose = new EventChannel()
  readonly onError = new EventChannel()
  readonly onMessage = new EventChannel<[IncomingMessage]>()

  private constructor(private socket: WebSocket) {
    socket.onopen = () => this.onOpen.send()
    socket.onclose = () => this.onClose.send()
    socket.onerror = () => this.onError.send()
    socket.onmessage = ({ data }) =>
      this.onMessage.send(JSON.parse(String(data)))
  }

  static fromSocket<O, I>(socket: WebSocket) {
    return new TypedSocket<O, I>(socket)
  }

  static fromUrl<O, I>(url: string) {
    return new TypedSocket<O, I>(new WebSocket(url))
  }

  send(message: OutgoingMessage) {
    this.socket.send(JSON.stringify(message))
  }

  removeListeners() {
    this.onOpen.clear()
    this.onClose.clear()
    this.onError.clear()
    this.onMessage.clear()
  }

  disconnect() {
    this.socket.close()
  }
}
