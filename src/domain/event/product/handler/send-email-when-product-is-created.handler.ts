import type { EventHandlerInterface } from '../../shared/event-handler.interface'
import type { ProductCreatedEvent } from '../product-created.event'

export class SendEmailWhenProductIsCreatedHandler
  implements EventHandlerInterface
{
  handle(event: ProductCreatedEvent): void {
    console.log(`Sending email to...`)
    console.log(event)
  }
}
