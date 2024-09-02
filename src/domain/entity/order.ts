import { OrderItem } from './order-item'

export class Order {
  private _id: string
  private _customerId: string
  private _items: OrderItem[]

  constructor(id: string, customerId: string, items: OrderItem[]) {
    if (!id) {
      throw new Error('Id is required')
    }

    if (!customerId) {
      throw new Error('CustomerId is required')
    }

    if (items.length === 0) {
      throw new Error('Items are required')
    }

    this._id = id
    this._customerId = customerId
    this._items = items
  }

  get id(): string {
    return this._id
  }

  get customerId(): string {
    return this._customerId
  }

  get items(): OrderItem[] {
    return this._items
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0)
  }

  changeItems(items: OrderItem[]): void {
    if (items.length === 0) {
      throw new Error('Items are required')
    }
    this._items = items
  }
}
