import { GameState } from "../core/gameState"
import { GameClientMessage } from "../core/messageTypes"
import { ClientRoom } from "../framework/ClientRoom"

export type GameClientRoom = ClientRoom<GameState, GameClientMessage>
