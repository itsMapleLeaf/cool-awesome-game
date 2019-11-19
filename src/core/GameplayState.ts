import { MapSchema, Schema, type } from "@colyseus/schema"
import { PlayerState } from "./PlayerState"

export class GameplayState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>()

  createPlayer(id: string) {
    this.players[id] = new PlayerState()
  }

  removePlayer(id: string) {
    delete this.players[id]
  }

  getPlayer(id: string): PlayerState | undefined {
    return this.players[id]
  }
}
