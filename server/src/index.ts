import ws from "ws"

const server = new ws.Server({ port: 3001 })

server.on("connection", (socket, request) => {
  console.log(`connection from ${request.connection.remoteAddress}`)

  socket.send(JSON.stringify({ message: "hi" }))

  socket.on("message", (data) => {
    const json = JSON.parse(String(data))
    console.log(json)
  })
})

server.on("listening", () => {
  console.log(`listening on http://localhost:${server.options.port}`)
})
