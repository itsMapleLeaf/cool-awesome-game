import {
  addPlayer,
  GameState,
  initialGameState,
  movePlayer,
  removePlayer,
} from "../core/gameState"
import { GameClientMessage } from "../core/messageTypes"
import { Server } from "../framework/Server"

const server = new Server()

const room = server.createRoom<GameState, GameClientMessage>({
  id: "gameplay",
  initialState: initialGameState,
})

room.onJoin.listen((client) => {
  room.setState(addPlayer(client.id))
})

room.onLeave.listen((client) => {
  room.setState(removePlayer(client.id))
})

room.onMessage.listen((client, message) => {
  switch (message.type) {
    case "move-left":
      room.setState(movePlayer(client.id, -1))
      break

    case "move-right":
      room.setState(movePlayer(client.id, 1))
      break
  }
})
