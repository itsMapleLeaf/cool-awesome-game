import { Diff } from "deep-diff"
import { TypedSocket } from "./TypedSocket"
import { TypedSocketServer } from "./TypedSocketServer"

export type FrameworkServer<UserMessage> = TypedSocketServer<
  ClientMessage<UserMessage>,
  ServerMessage<UserMessage>
>

export type FrameworkServerSocket<UserMessage> = TypedSocket<
  ClientMessage<UserMessage>,
  ServerMessage<UserMessage>
>

export type FrameworkClientSocket<UserMessage, State = unknown> = TypedSocket<
  ServerMessage<UserMessage, State>,
  ClientMessage<UserMessage>
>

export type ClientMessage<UserMessage> =
  | { type: "server-message"; message: UserMessage }
  | { type: "join-room"; roomId: string }
  | { type: "leave-room"; roomId: string }
  | { type: "room-client-message"; roomId: string; message: UserMessage }

export type ServerMessage<UserMessage, State = unknown> =
  | { type: "joined-room"; roomId: string; state: State }
  | { type: "left-room"; roomId: string }
  | { type: "room-state"; roomId: string; state: State }
  | { type: "room-state-update"; roomId: string; changes: Diff<State>[] }
  | { type: "client-message"; message: UserMessage }
