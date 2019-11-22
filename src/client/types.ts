import { GameState } from "../core/gameState"
import { GameMessage } from "../core/messageTypes"
import { ClientRoom } from "../framework/ClientRoom"

export type GameClientRoom = ClientRoom<GameState, GameMessage>
