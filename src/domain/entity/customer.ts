import { AddressChangedEvent } from '../event/customer/address-changed.event'
import { CustomerCreatedEvent } from '../event/customer/customer-created.event'
import { EnviaConsoleLog1Handler } from '../event/customer/handler/envia-console-log1-handler'
import { AddressCreatedHandler } from '../event/customer/handler/envia-console-log1-handler copy'
import { EnviaConsoleLog2Handler } from '../event/customer/handler/envia-console-log2-handler'
import { EventDispatcher } from '../event/shared/event-dispatcher'
import type { Address } from './address'

export class Customer {
  private _id: string
  private _name: string
  private _address!: Address
  private _active = false
  private _rewardPoints = 0
  private readonly _eventDispatcher = new EventDispatcher()

  constructor(id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
    this.created()
  }

  private created() {
    const eviaConsoleLog1 = new EnviaConsoleLog1Handler()
    const eviaConsoleLog2 = new EnviaConsoleLog2Handler()
    this._eventDispatcher.register('CustomerCreatedEvent', eviaConsoleLog1)
    this._eventDispatcher.register('CustomerCreatedEvent', eviaConsoleLog2)
    this._eventDispatcher.notify(new CustomerCreatedEvent(this))
  }

  get name() {
    return this._name
  }

  get id() {
    return this._id
  }

  get rewardPoints() {
    return this._rewardPoints
  }

  changeAddress(address: Address) {
    this._address = address
    this.addressChanged()
  }

  private addressChanged() {
    this._eventDispatcher.register(
      'AddressChangedEvent',
      new AddressCreatedHandler(),
    )
    this._eventDispatcher.notify(
      new AddressChangedEvent({
        id: this._id,
        name: this._name,
        address: this._address._street,
      }),
    )
  }

  isActive() {
    return this._active
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
    if (this._name.length === 0) {
      throw new Error('Name is required')
    }
  }

  get address() {
    return this._address
  }

  set address(address: Address) {
    this._address = address
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('Address is mandatory to activate a customer')
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }
}
