export function createStore<S, A>(
  getNextState: (state: S, action: A) => S,
  initialState: S,
) {
  let currentState = initialState
  let subscriptions = new Set<(state: S) => void>()

  function dispatch(action: A) {
    currentState = getNextState(currentState, action)
  }

  function subscribe(subscription: (state: S) => void) {
    subscriptions.add(subscription)
    return () => subscriptions.delete(subscription)
  }

  function getState() {
    return currentState
  }

  return { dispatch, subscribe, getState }
}
