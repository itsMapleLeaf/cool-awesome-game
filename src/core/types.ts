export type SocketMessageBase = { id: string }

export type ClientMessageBase =
  | { type: "new-room" }
  | { type: "join-room"; roomId: string }
  | { type: "move"; direction: -1 | 1 }

export type ServerMessageBase = { type: "new-room"; id: string }

export type ClientMessage = SocketMessageBase & ClientMessageBase

export type ServerMessage = SocketMessageBase & ServerMessageBase
