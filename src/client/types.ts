import { TypedWebSocket } from "../core/TypedWebSocket"
import { ClientMessage, ServerMessage } from "../core/types"

export type ClientSocket = TypedWebSocket<ClientMessage, ServerMessage>
