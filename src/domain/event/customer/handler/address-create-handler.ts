import type { EventHandlerInterface } from '../../shared/event-handler.interface'
import type { AddressChangedEvent } from '../address-changed.event'

export class AddressCreatedHandler implements EventHandlerInterface {
  handle(event: AddressChangedEvent): void {
    console.log(
      `Handler: EnviaConsoleLogHandler. Mensagem: Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`,
    )
  }
}
