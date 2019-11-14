export function createSocket(url: string) {
  return new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url)

    const onOpen = () => {
      resolve(ws)
      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("close", onClose)
    }

    const onClose = () => {
      reject(new Error("Failed to connect"))
      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("close", onClose)
    }

    ws.addEventListener("open", onOpen)
    ws.addEventListener("error", onClose)
  })
}
