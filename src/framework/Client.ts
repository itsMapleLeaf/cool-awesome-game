import { applyChange, Diff } from "deep-diff"
import produce from "immer"
import WebSocket from "isomorphic-ws"
import { sleep } from "../common/sleep"
import { EventChannel } from "./EventChannel"
import { ClientMessage, ServerMessage } from "./types"

// using a symbol for a lack of state to support _any_ state value
const noState = Symbol()

export class Client<State, OutgoingMessage> {
  private socket?: WebSocket
  private state: State | typeof noState = noState

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
        case "state": {
          this.state = message.state
          this.onNewState.send(message.state)
          break
        }

        case "update-state": {
          // maybe request the full state if we don't have local state?
          if (this.state !== noState) {
            this.state = applyStateChanges(this.state, message.changes)
            this.onNewState.send(this.state)
          }
          break
        }
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

function applyStateChanges<S>(state: S, changes: Diff<S, S>[]) {
  return produce(state, (draft) => {
    for (const change of changes) {
      applyChange(draft, {}, change as any)
    }
  })
}
