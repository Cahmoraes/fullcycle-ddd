import type { EventHandlerInterface } from '../../shared/event-handler.interface'

export class EnviaConsoleLog1Handler implements EventHandlerInterface {
  handle(): void {
    console.log(
      'Handler1: EnviaConsoleLog1Handler. Mensagem: "Esse é o primeiro console.log do evento: CustomerCreated"',
    )
  }
}
