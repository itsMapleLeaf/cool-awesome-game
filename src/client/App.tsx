import React, { useEffect, useState } from "react"
import { Canvas } from "react-three-fiber"
import { GameState, initialGameState } from "../core/gameState"
import { GameClientMessage } from "../core/messageTypes"
import { Client } from "../framework/Client"
import { ClientRoom } from "../framework/ClientRoom"
import Game from "./Game"
import { GameClient } from "./types"
import { useWindowEvent } from "./useWindowEvent"

export default function App() {
  const [room, setRoom] = useState<ClientRoom>()
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  useEffect(() => {
    const client: GameClient = new Client()

    client.connect(`ws://localhost:3001`)

    client.onConnected.listen(() => {
      const room = client.joinRoom<GameState, GameClientMessage>("gameplay")

      room.onJoin.listen(() => {
        setRoom(room)
      })

      room.onLeave.listen(() => {
        setRoom(undefined)
      })

      room.onNewState.listen(setGameState)
    })

    return () => client.disconnect()
  }, [])

  useWindowEvent("keydown", (event) => {
    const bindings: { [_ in string]?: () => void } = {
      ArrowLeft: () => room?.sendMessage({ type: "move-left" }),
      ArrowRight: () => room?.sendMessage({ type: "move-right" }),
    }

    bindings[event.key]?.()
  })

  return (
    <Canvas gl2>
      <Game state={gameState} />
    </Canvas>
  )
}
