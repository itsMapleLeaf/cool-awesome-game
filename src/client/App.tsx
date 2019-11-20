import React, { useEffect, useState } from "react"
import { Canvas } from "react-three-fiber"
import { GameState, initialGameState } from "../core/gameState"
import { Client } from "../framework/Client"
import Game from "./Game"
import { GameClient } from "./types"
import { useWindowEvent } from "./useWindowEvent"

export default function App() {
  const [client, setClient] = useState<GameClient>()
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  useEffect(() => {
    const client: GameClient = new Client(`ws://localhost:3001`)

    client.onConnected.listen(() => {
      setClient(client)
    })

    client.onDisconnected.listen(() => {})

    client.onNewState.listen(setGameState)

    return () => client.disconnect()
  }, [])

  useWindowEvent("keydown", (event) => {
    const bindings: { [_ in string]?: () => void } = {
      ArrowLeft: () => client?.sendMessage({ type: "move-left" }),
      ArrowRight: () => client?.sendMessage({ type: "move-right" }),
    }

    bindings[event.key]?.()
  })

  return (
    <Canvas gl2>
      <Game state={gameState} />
    </Canvas>
  )
}
