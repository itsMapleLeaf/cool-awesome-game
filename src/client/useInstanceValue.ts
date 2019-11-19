import { useRef } from "react"

const noValue = Symbol()

export function useInstanceValue<T>(createValue: () => T) {
  const ref = useRef<T | typeof noValue>(noValue)
  if (ref.current === noValue) {
    ref.current = createValue()
  }
  return ref.current
}
