export type ClientMessage =
  | { type: "new-room" }
  | { type: "join-room"; id: string }
  | { type: "move"; direction: -1 | 1 }

export type ServerMessage = { type: "new-room"; id: string }
