import { Client, Room } from "colyseus.js"
import React, { useEffect, useRef } from "react"
import { Canvas, useFrame } from "react-three-fiber"
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
  const stateRef = useRef<GameplayState>()
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    client.joinOrCreate("gameplay").then((room) => {
      roomRef.current = room

      room.onStateChange((state) => {
        stateRef.current = state
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

  useFrame(() => {
    const mesh = meshRef.current

    const sessionId = roomRef.current?.sessionId
    if (!sessionId) return

    const player: PlayerState | undefined = stateRef.current?.players[sessionId]
    mesh?.position.set(player?.position ?? 0, 0, 0)
  })

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}
