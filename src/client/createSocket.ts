import { TypedWebSocket } from "../core/TypedWebSocket"
import { ClientSocket } from "./types"

export function createSocket(url: string) {
  return new Promise<ClientSocket>((resolve, reject) => {
    const socket: ClientSocket = new TypedWebSocket(new WebSocket(url))

    const unlistenOpen = socket.onOpen(() => {
      resolve(socket)
      unlistenOpen()
      unlistenClose()
    })

    const unlistenClose = socket.onClose(() => {
      reject(new Error("Failed to connect"))
      unlistenOpen()
      unlistenClose()
    })
  })
}
