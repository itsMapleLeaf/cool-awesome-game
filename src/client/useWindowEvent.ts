import { useEffect } from "react"

export function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  handler: (event: WindowEventMap[E]) => void,
  options?: AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(event, handler, options)
    return () => window.removeEventListener(event, handler)
  }, [event, handler, options])
}
