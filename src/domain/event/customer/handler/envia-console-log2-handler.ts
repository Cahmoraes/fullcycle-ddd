import type { EventHandlerInterface } from '../../shared/event-handler.interface'

export class EnviaConsoleLog2Handler implements EventHandlerInterface {
  handle(): void {
    console.log(
      'Handler2: EnviaConsoleLog2Handler. Mensagem: "Esse é o segundo console.log do evento: CustomerCreated". "',
    )
  }
}
