import uuid from "uuid/v4"
import {
  addPlayer,
  GameState,
  initialGameState,
  movePlayer,
  removePlayer,
} from "../core/gameState"
import {
  ClientMessageType,
  GameMessage,
  ServerMessageType,
} from "../core/messageTypes"
import { Server } from "../framework/Server"

const server = new Server<GameMessage>()

function createGameplayRoom() {
  const room = server.createRoom<GameState>({
    id: uuid(),
    initialState: initialGameState,
  })

  room.onJoin.listen((client) => {
    room.setState(addPlayer(client.id))
  })

  room.onLeave.listen((client) => {
    if (room.getState().players.length === 1) {
      server.removeRoom(room.id)
    } else {
      room.setState(removePlayer(client.id))
    }
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

  return room
}

server.onMessage.listen((client, message) => {
  switch (message.type) {
    case ClientMessageType.NewGame: {
      const room = createGameplayRoom()

      client.sendMessage({
        type: ServerMessageType.RoomCreated,
        roomId: room.id,
      })

      break
    }
  }
})
