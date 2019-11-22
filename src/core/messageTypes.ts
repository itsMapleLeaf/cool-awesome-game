export enum ClientMessageType {
  MoveLeft,
  MoveRight,
}

export type GameMessage =
  | { type: ClientMessageType.MoveLeft }
  | { type: ClientMessageType.MoveRight }
