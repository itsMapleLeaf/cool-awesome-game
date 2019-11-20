import {
  addPlayer,
  GameState,
  initialGameState,
  movePlayer,
  removePlayer,
} from "../core/gameState"
import { GameClientMessage } from "../core/messageTypes"
import { Server } from "../framework/Server"

const server = new Server<GameState, GameClientMessage>({
  initialState: initialGameState,
})

server.onConnect.listen((client) => {
  server.setState(addPlayer(client.id))
})

server.onDisconnect.listen((client) => {
  server.setState(removePlayer(client.id))
})

server.onMessage.listen((client, message) => {
  switch (message.type) {
    case "move-left":
      server.setState(movePlayer(client.id, -1))
      break

    case "move-right":
      server.setState(movePlayer(client.id, 1))
      break
  }
})
