import WebSocket from "isomorphic-ws"
import { sleep } from "../common/sleep"
import { EventChannel } from "./EventChannel"
import { ClientMessage, ServerMessage } from "./types"

export class Client<State, OutgoingMessage> {
  private socket?: WebSocket

  onConnected = new EventChannel()
  onDisconnected = new EventChannel()
  onNewState = new EventChannel<[State]>()

  constructor(url: string) {
    this.connect(url)
  }

  private connect(url: string) {
    const socket = (this.socket = new WebSocket(url))

    socket.onopen = () => {
      this.onConnected.send()
    }

    socket.onclose = async () => {
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    }

    socket.onerror = async () => {
      this.onDisconnected.send()
      await sleep(1000)
      this.connect(url)
    }

    socket.onmessage = ({ data }) => {
      const message: ServerMessage<State> = JSON.parse(String(data))
      switch (message.type) {
        case "state":
          this.onNewState.send(message.state)
          break
      }
    }
  }

  private send(data: ClientMessage<OutgoingMessage>) {
    this.socket?.send(JSON.stringify(data))
  }

  sendMessage(message: OutgoingMessage) {
    this.send({ type: "client-message", message })
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
    this.onNewState.clear()
  }
}
