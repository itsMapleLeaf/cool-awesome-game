import React, { useEffect, useState } from "react"
import { Canvas } from "react-three-fiber"
import { GameState, initialState } from "../core/gameState"
import { GameClientMessage } from "../core/types"
import { Client } from "../framework/Client"
import { useWindowEvent } from "./useWindowEvent"

export default function App() {
  return (
    <Canvas gl2>
      <Game />
    </Canvas>
  )
}

type GameStatus = "connecting" | "gameplay"

type GameClient = Client<GameState, GameClientMessage>

function Game() {
  const [client, setClient] = useState<GameClient>()
  const [status, setStatus] = useState<GameStatus>("connecting")
  const [gameState, setGameState] = useState<GameState>(initialState)

  useEffect(() => {
    const client: GameClient = new Client(`ws://localhost:3001`)

    client.onConnected.listen(() => {
      setStatus("gameplay")
      setClient(client)
    })

    client.onDisconnected.listen(() => {
      setStatus("connecting")
    })

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

  switch (status) {
    case "connecting":
      // i dunno how to render text with three
      return null

    case "gameplay":
      return (
        <>
          {gameState.players.map((player, index) => (
            <mesh key={index} position={[player.position, 0, 0]}>
              <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
              <meshNormalMaterial attach="material" />
            </mesh>
          ))}
        </>
      )
  }
}
