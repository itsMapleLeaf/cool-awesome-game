import React from "react"
import { GameState } from "../core/gameState"

type Props = { state: GameState }

export default function Game({ state }: Props) {
  return (
    <>
      {state.players.map((player) => (
        <mesh key={player.id} position={[player.position, 0, 0]}>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      ))}
    </>
  )
}
