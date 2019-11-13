import ws from "ws"

const server = new ws.Server({ port: 3001 })

server.on("connection", (socket) => {
  console.log(`connection from ${socket.url}`)

  socket.send(JSON.stringify({ message: "hi" }))
})

server.on("listening", () => {
  console.log(`listening on http://localhost:${server.options.port}`)
})
