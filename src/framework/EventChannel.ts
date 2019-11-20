type EventChannelListener<A extends unknown[]> = (...args: A) => void

export class EventChannel<A extends unknown[] = []> {
  private listeners = new Set<EventChannelListener<A>>()

  send(...args: A) {
    this.listeners.forEach((l) => l(...args))
  }

  listen(listener: EventChannelListener<A>) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  clear() {
    this.listeners.clear()
  }
}
