export enum ClientMessageType {
  NewGame,
  MoveLeft,
  MoveRight,
}

export enum ServerMessageType {
  RoomCreated,
}

export type GameMessage =
  | { type: ClientMessageType.NewGame }
  | { type: ClientMessageType.MoveLeft }
  | { type: ClientMessageType.MoveRight }
  | { type: ServerMessageType.RoomCreated; roomId: string }
