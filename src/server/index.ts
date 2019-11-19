import { Server } from "colyseus"
import { GameplayRoom } from "./GameplayRoom"

const port = Number(process.env.port) || 3001

const gameServer = new Server()

gameServer.define("gameplay", GameplayRoom)

gameServer.listen(port, undefined, undefined, () => {
  console.log(`listening on http://localhost:${port}`)
})
