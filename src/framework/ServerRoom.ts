import { diff } from "deep-diff"
import { EventChannel } from "./EventChannel"
import { Server } from "./Server"
import { ServerClient } from "./ServerClient"

export type ServerRoomOptions<State> = {
  id: string
  initialState: State
}

export class ServerRoom<State = unknown, IncomingMessage = unknown> {
  private state: State
  private readonly clients = new Map<string, ServerClient>()
  private server: Server

  readonly id: string
  readonly onJoin = new EventChannel<[ServerClient]>()
  readonly onLeave = new EventChannel<[ServerClient]>()
  readonly onMessage = new EventChannel<[ServerClient, IncomingMessage]>()

  constructor(options: ServerRoomOptions<State>, server: Server) {
    this.id = options.id
    this.state = options.initialState
    this.server = server
  }

  addClient(client: ServerClient) {
    this.clients.set(client.id, client)
    client.send({ type: "joined-room", roomId: this.id, state: this.state })
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId)
    client?.send({ type: "left-room", roomId: this.id })
    this.clients.delete(clientId)
  }

  setState(getNewState: (oldState: State) => State) {
    const newState = getNewState(this.state)
    const stateDiff = diff(this.state, newState)

    if (stateDiff) {
      this.state = newState
      // this.broadcast({ type: "update-state", changes: stateDiff })
    }
  }
}
