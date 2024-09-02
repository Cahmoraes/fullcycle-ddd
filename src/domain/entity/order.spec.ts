import { Order } from './order'
import { OrderItem } from './order-item'

describe('Order unit tests', () => {
  it('should throw error when id is empty', () => {
    const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2)
    expect(() => {
      new Order('', '123', [item])
    }).toThrowError('Id is required')
  })

  it('should throw error when customerId is empty', () => {
    const item = new OrderItem('i1', 'Item 1', 100, 'p1', 1)
    expect(() => {
      new Order('123', '', [item])
    }).toThrowError('CustomerId is required')
  })

  it('should throw error when items is empty', () => {
    expect(() => {
      new Order('123', '456', [])
    }).toThrowError('Items are required')
  })

  it('should calculate total', () => {
    const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2)
    const item2 = new OrderItem('i2', 'Item 2', 200, 'p2', 2)
    const order = new Order('o1', 'c1', [item])
    expect(order.total()).toBe(200)
    const order2 = new Order('o2', 'c2', [item, item2])
    expect(order2.total()).toBe(600)
  })

  it('should throw error if item quantity is less or equal than 0', () => {
    expect(() => {
      const item = new OrderItem('i1', 'Item 1', 100, 'p1', 0)
      new Order('o1', 'c1', [item])
    }).toThrowError('Quantity must be greater than 0')
  })
})
