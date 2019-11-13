import ws from "ws"

const server = new ws.Server({ port: 3001 })

server.on("connection", (socket, request) => {
  const address = request.connection.remoteAddress
  console.log(`connected: ${address}`)

  socket.send(JSON.stringify({ message: "hi" }))

  socket.on("message", (data) => {
    const json = JSON.parse(String(data))
    console.log(json)
  })

  socket.on("close", () => {
    console.log(`disconnected: ${address}`)
  })
})

server.on("listening", () => {
  console.log(`listening on http://localhost:${server.options.port}`)
})
