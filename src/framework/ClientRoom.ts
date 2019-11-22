import { applyStateChanges } from "./applyStateChanges"
import { EventChannel } from "./EventChannel"
import { FrameworkClientSocket, ServerMessage } from "./types"

type ClientRoomOptions = { id: string }

// using a symbol for a lack of state to support _any_ state value
const noState = Symbol()

export class ClientRoom<UserMessage = unknown, State = unknown> {
  private state: State | typeof noState = noState
  private readonly socket: FrameworkClientSocket<UserMessage, State>

  readonly id: string
  readonly onJoin = new EventChannel()
  readonly onLeave = new EventChannel()
  readonly onNewState = new EventChannel<[State]>()

  constructor(
    options: ClientRoomOptions,
    socket: FrameworkClientSocket<UserMessage, State>,
  ) {
    this.id = options.id
    this.socket = socket
  }

  sendMessage(message: UserMessage) {
    this.socket.send({ type: "room-client-message", roomId: this.id, message })
  }

  handleServerMessage(message: ServerMessage<UserMessage, State>) {
    switch (message.type) {
      case "joined-room": {
        this.onJoin.send()
        this.state = message.state
        this.onNewState.send(message.state)
        break
      }

      case "left-room": {
        this.onLeave.send()
        break
      }

      case "room-state": {
        this.state = message.state
        this.onNewState.send(message.state)
        break
      }

      case "room-state-update": {
        if (this.state !== noState) {
          this.state = applyStateChanges(this.state, message.changes)
          this.onNewState.send(this.state)
        }
        break
      }
    }
  }
}
