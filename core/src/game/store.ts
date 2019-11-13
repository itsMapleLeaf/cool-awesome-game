import produce from "immer"
import { clamp } from "../common/clamp"
import { createStore } from "../common/store"

type GameState = {
  players: PlayerState[]
}

type PlayerState = {
  pos: number
}

// shall add more actions later
type GameStateAction = { type: "movePlayer"; index: number; direction: -1 | 1 }

const getNextGameState = produce(
  (state: GameState, action: GameStateAction) => {
    switch (action.type) {
      case "movePlayer":
        const player = state.players[action.index] as PlayerState | undefined
        if (player) {
          player.pos = clamp(player.pos + 0.05 * action.direction, 0, 1)
        }
        break
    }
  },
)

export const gameStore = createStore<GameState, GameStateAction>(
  getNextGameState,
  { players: [] },
)
