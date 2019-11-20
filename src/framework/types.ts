export type ClientMessage<D> = { type: "client-message"; message: D }

export type ServerMessage<State> = { type: "state"; state: State }
