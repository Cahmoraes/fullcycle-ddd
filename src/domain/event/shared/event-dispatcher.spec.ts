import { SendEmailWhenProductIsCreatedHandler } from '../product/handler/send-email-when-product-is-created.handler'
import { ProductCreatedEvent } from '../product/product-created.event'
import { EventDispatcher } from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    expect(eventDispatcher.eventHandlers['ProductCreatedEvent']).toBeDefined()
    expect(eventDispatcher.eventHandlers['ProductCreatedEvent'].length).toBe(1)
    expect(
      eventDispatcher.eventHandlers['ProductCreatedEvent'][0],
    ).toMatchObject(eventHandler)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)
    expect(eventDispatcher.eventHandlers['ProductCreatedEvent'].length).toBe(0)
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.unregisterAll()
    expect(eventDispatcher.eventHandlers).toEqual({})
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyEventHandler = vi.spyOn(eventHandler, 'handle')
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product 1 description',
      price: 10,
    })
    eventDispatcher.notify(productCreatedEvent)
    expect(spyEventHandler).toHaveBeenCalled()
  })
})
