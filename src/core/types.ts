export type ClientMessage = { type: "move-left" } | { type: "move-right" }

export type ServerMessage = { type: "client-init"; clientId: string }
