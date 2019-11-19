import { Client, Room } from "colyseus.js"
import React, { useEffect, useRef, useState } from "react"
import { Canvas } from "react-three-fiber"
import { Mesh } from "three"
import { GameplayState } from "../core/GameplayState"
import { PlayerState } from "../core/PlayerState"
import { useInstanceValue } from "./useInstanceValue"
import { useWindowEvent } from "./useWindowEvent"

export default function App() {
  return (
    <Canvas gl2>
      <Game />
    </Canvas>
  )
}

function Game() {
  const client = useInstanceValue(() => new Client(`ws://localhost:3001`))
  const roomRef = useRef<Room>()
  const [state, setState] = useState<GameplayState>()
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    client.joinOrCreate("gameplay").then((room) => {
      roomRef.current = room

      room.onStateChange((state: GameplayState) => {
        setState(state.toJSON() as any) // i hate this
      })
    })
    return () => roomRef.current?.leave()
  }, [])

  useWindowEvent("keydown", (event) => {
    const room = roomRef.current

    const bindings: { [_ in string]?: () => void } = {
      ArrowLeft: () => room?.send({ type: "move-left" }),
      ArrowRight: () => room?.send({ type: "move-right" }),
    }

    bindings[event.key]?.()
  })

  const players: PlayerState[] = Object.values(state?.players ?? {})

  return (
    <>
      {players.map((player, index) => (
        <mesh key={index} ref={meshRef} position={[player.position, 0, 0]}>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      ))}
    </>
  )
}
