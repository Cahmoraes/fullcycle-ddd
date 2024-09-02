import type { EventDispatcherInterface } from './event-dispatcher.interface'
import type { EventHandlerInterface } from './event-handler.interface'
import type { EventInterface } from './event.interface'

type EventHandlers = Record<string, EventHandlerInterface[]>

export class EventDispatcher implements EventDispatcherInterface {
  private _eventHandlers: EventHandlers = {}

  get eventHandlers() {
    return this._eventHandlers
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name
    if (!this._eventHandlers[eventName]) return
    this._eventHandlers[eventName].forEach((eventHandler) => {
      eventHandler.handle(event)
    })
  }

  register(eventName: string, eventHandler: EventHandlerInterface): void {
    if (!this._eventHandlers[eventName]) this._eventHandlers[eventName] = []
    this._eventHandlers[eventName].push(eventHandler)
  }

  unregister(eventName: string, eventHandler: EventHandlerInterface): void {
    if (!this._eventHandlers[eventName]) return
    const index = this._eventHandlers[eventName].indexOf(eventHandler)
    if (index < 0) return
    this._eventHandlers[eventName].splice(index, 1)
  }

  unregisterAll(): void {
    this._eventHandlers = {}
  }
}
