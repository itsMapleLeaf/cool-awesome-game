import { diff } from "deep-diff"
import { EventChannel } from "./EventChannel"
import { ServerClient } from "./ServerClient"
import { ClientMessage, FrameworkServer } from "./types"

export type ServerRoomOptions<State> = {
  id: string
  initialState: State
}

export class ServerRoom<UserMessage, State = unknown> {
  private state: State
  private readonly clients = new Map<string, ServerClient<UserMessage>>()
  private readonly server: FrameworkServer<UserMessage>

  readonly id: string
  readonly onJoin = new EventChannel<[ServerClient<UserMessage>]>()
  readonly onLeave = new EventChannel<[ServerClient<UserMessage>]>()
  readonly onMessage = new EventChannel<
    [ServerClient<UserMessage>, UserMessage]
  >()

  constructor(
    options: ServerRoomOptions<State>,
    server: FrameworkServer<UserMessage>,
  ) {
    this.id = options.id
    this.state = options.initialState
    this.server = server
  }

  handleClientMessage(
    client: ServerClient<UserMessage>,
    message: ClientMessage<UserMessage>,
  ) {
    switch (message.type) {
      case "join-room": {
        this.addClient(client)
        break
      }

      case "leave-room": {
        this.removeClient(client.id)
        break
      }

      case "room-client-message": {
        this.onMessage.send(client, message.message)
        break
      }
    }
  }

  addClient(client: ServerClient<UserMessage>) {
    this.clients.set(client.id, client)
    this.onJoin.send(client)
    client.socket.send({
      type: "joined-room",
      roomId: this.id,
      state: this.state,
    })
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId)
    if (client) {
      this.onLeave.send(client)
      client.socket.send({ type: "left-room", roomId: this.id })
    }
    this.clients.delete(clientId)
  }

  removeAllClients() {
    for (const [, client] of this.clients) {
      this.removeClient(client.id)
    }
  }

  get clientCount() {
    return this.clients.size
  }

  getState(): Readonly<State> {
    return this.state
  }

  setState(getNewState: (oldState: State) => State) {
    const newState = getNewState(this.state)
    const changes = diff(this.state, newState)

    if (changes) {
      this.state = newState
      this.server.broadcast({
        type: "room-state-update",
        roomId: this.id,
        changes,
      })
    }
  }
}
