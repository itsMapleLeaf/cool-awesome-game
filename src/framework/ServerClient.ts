import { FrameworkServerSocket } from "./types"

export class ServerClient<UserMessage> {
  constructor(
    public id: string,
    public socket: FrameworkServerSocket<UserMessage>,
  ) {}

  sendMessage(message: UserMessage) {
    this.socket.send({ type: "client-message", message })
  }
}
