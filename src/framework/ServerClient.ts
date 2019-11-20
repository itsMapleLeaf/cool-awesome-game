import { FrameworkServerSocket } from "./types"

export class ServerClient {
  constructor(public id: string, public socket: FrameworkServerSocket) {}
}
