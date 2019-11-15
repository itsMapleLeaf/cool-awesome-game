export type ClientMessage =
  | { type: "new-room" }
  | { type: "join-room"; roomId: string }
  | { type: "move"; direction: -1 | 1 }

export type ServerMessage = { type: "new-room"; roomId: string }
