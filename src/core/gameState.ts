import produce, { Draft } from "immer"

export type GameState = {
  players: PlayerState[]
}

export type PlayerState = {
  id: string
  name: string
  position: number
}

export const initialGameState: GameState = {
  players: [],
}

export const addPlayer = (id: string) =>
  produce((draft: Draft<GameState>) => {
    draft.players.push({
      id,
      name: id,
      position: 0,
    })
  })

export const removePlayer = (id: string) =>
  produce((draft: Draft<GameState>) => {
    draft.players = draft.players.filter((p) => p.id != id)
  })

export const movePlayer = (id: string, delta: number) =>
  produce((draft: Draft<GameState>) => {
    const player = draft.players.find((p) => p.id === id)
    if (player) {
      player.position += delta
    }
  })
