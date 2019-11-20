import { GameState } from "../core/gameState"
import { GameClientMessage } from "../core/messageTypes"
import { Client } from "../framework/Client"

export type GameClient = Client<GameState, GameClientMessage>
