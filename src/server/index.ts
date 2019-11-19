import { Server } from "colyseus"
import express from "express"
import { createServer } from "http"
const app = express()

app.use(express.json())

const gameServer = new Server({
  server: createServer(app),
})

const port = Number(process.env.port) || 3001
gameServer.listen(port, undefined, undefined, () => {
  console.log(`listening on http://localhost:${port}`)
})
