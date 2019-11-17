export type ClientMessage = { type: "move"; direction: -1 | 1 }

export type ServerMessage = { type: "client-init"; clientId: string }
