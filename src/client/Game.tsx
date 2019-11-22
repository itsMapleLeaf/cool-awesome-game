import React, { useEffect, useState } from "react"
import { Canvas } from "react-three-fiber"
import { Key } from "ts-key-enum"
import { GameState, initialGameState } from "../core/gameState"
import { Client } from "../framework/Client"
import GameView from "./GameView"
import { GameClientRoom } from "./types"
import { useWindowEvent } from "./useWindowEvent"

type Props = {
  roomId: string
}

function Game({ roomId }: Props) {
  const [room, setRoom] = useState<GameClientRoom>()
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  useEffect(() => {
    const client = new Client()

    client.connect(`ws://localhost:3001`)

    client.onConnected.listen(() => {
      const room = client.joinRoom<GameState>(roomId)

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
      [Key.ArrowLeft]: () => room?.sendMessage({ type: "move-left" }),
      [Key.ArrowRight]: () => room?.sendMessage({ type: "move-right" }),
    }

    bindings[event.key]?.()
  })

  return (
    <Canvas gl2>
      <GameView state={gameState} />
    </Canvas>
  )
}

export default Game
