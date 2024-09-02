import { Address } from '../../entity/address'
import { Customer } from '../../entity/customer'
import { EnviaConsoleLog1Handler } from './handler/envia-console-log1-handler'
import { AddressCreatedHandler } from './handler/envia-console-log1-handler copy'
import { EnviaConsoleLog2Handler } from './handler/envia-console-log2-handler'

describe('Customer events tests', () => {
  it('should create event when user is created', () => {
    const eventDispatcherHandler1Spy = vi.spyOn(
      EnviaConsoleLog1Handler.prototype,
      'handle',
    )
    const eventDispatcherHandler2Spy = vi.spyOn(
      EnviaConsoleLog2Handler.prototype,
      'handle',
    )
    new Customer('123', 'Customer 1')
    expect(eventDispatcherHandler1Spy).toHaveBeenCalled()
    expect(eventDispatcherHandler2Spy).toHaveBeenCalled()
  })

  it('should notify when user address is changed', () => {
    const customer = new Customer('123', 'Customer 1')
    const addressChangedAddressEvent = vi.spyOn(
      AddressCreatedHandler.prototype,
      'handle',
    )
    customer.changeAddress(new Address('Street 2', 456, '1234', 'City 2'))
    expect(addressChangedAddressEvent).toHaveBeenCalled()
  })
})
