import {
  addPlayer,
  GameState,
  initialGameState,
  movePlayer,
  removePlayer,
} from "../core/gameState"
import { ClientMessageType, GameMessage } from "../core/messageTypes"
import { Server } from "../framework/Server"

const server = new Server<GameMessage>()

server.onListening.listen(() => {
  const room = server.createRoom<GameState>({
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
      case ClientMessageType.MoveLeft:
        room.setState(movePlayer(client.id, -1))
        break

      case ClientMessageType.MoveRight:
        room.setState(movePlayer(client.id, 1))
        break
    }
  })
})
