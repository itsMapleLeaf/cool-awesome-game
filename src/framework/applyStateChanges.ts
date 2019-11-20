import { applyChange, Diff } from "deep-diff"
import produce from "immer"

export function applyStateChanges<S>(state: S, changes: Diff<S>[]) {
  return produce(state, (draft) => {
    for (const change of changes) {
      applyChange(draft, {}, change as any)
    }
  })
}
