import { Client, Room } from "colyseus"
import { GameplayState } from "../core/GameplayState"
import { GameClientMessage } from "../core/types"

export class GameplayRoom extends Room<GameplayState> {
  maxClients = 2

  onCreate() {
    this.setState(new GameplayState())
  }

  onJoin(client: Client) {
    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    this.state.removePlayer(client.sessionId)
  }

  onMessage(client: Client, data: GameClientMessage): void {
    const player = this.state.getPlayer(client.id)
    switch (data.type) {
      case "move-left":
        player?.move(-1)
        break

      case "move-right":
        player?.move(1)
        break
    }
  }
}
