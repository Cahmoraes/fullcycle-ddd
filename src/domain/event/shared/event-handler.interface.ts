import type { EventInterface } from './event.interface'

export interface EventHandlerInterface {
  handle(event: EventInterface): void
}
