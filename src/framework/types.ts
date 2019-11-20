import { Diff } from "deep-diff"

export type ClientMessage<Message = unknown> =
  | { type: "join-room"; roomId: string }
  | { type: "leave-room"; roomId: string }
  | { type: "room-client-message"; roomId: string; message: Message }

export type ServerMessage<State = unknown> =
  | { type: "joined-room"; roomId: string; state: State }
  | { type: "left-room"; roomId: string }
  | { type: "room-state"; roomId: string; state: State }
  | { type: "room-state-update"; roomId: string; changes: Diff<State>[] }
