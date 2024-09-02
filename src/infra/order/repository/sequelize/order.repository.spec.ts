import { Sequelize } from 'sequelize-typescript'
import { CustomerModel } from '../../../customer/repository/sequelize/customer.model'
import { OrderModel } from './order.model'
import { OrderItemModel } from './order-item.model'
import { ProductModel } from '../../../db/sequelize/model/product.model'
import { CustomerRepository } from '../../../customer/repository/sequelize/customer.repository'
import { Customer } from '../../../../domain/entity/customer'
import { Address } from '../../../../domain/entity/address'
import { ProductRepository } from '../../../../repository/product.repository'
import { OrderItem } from '../../../../domain/entity/order-item'
import { Product } from '../../../../domain/entity/product'
import { Order } from '../../../../domain/entity/order'
import { OrderRepository } from './order.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      storage: ':memory:',
      dialect: 'sqlite',
      logging: false,
      sync: { force: true },
    })
    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const orderRepository = new OrderRepository()
    const order = new Order('123', customer.id, [orderItem])
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: [{ model: OrderItemModel, as: 'items' }],
    })

    expect(orderModel!.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          order_id: order.id,
          product_id: product.id,
          quantity: orderItem.quantity,
          price: orderItem.price,
          name: orderItem.name,
        },
      ],
    })
  })

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const orderRepository = new OrderRepository()
    const order = new Order('123', customer.id, [orderItem])
    await orderRepository.create(order)

    // Atualizando o pedido
    const updatedOrderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      3, // Mudando a quantidade de 2 para 3
    )
    order.changeItems([updatedOrderItem])
    await orderRepository.update(order)

    const updatedOrderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: [{ model: OrderItemModel, as: 'items' }],
    })

    expect(updatedOrderModel!.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: updatedOrderItem.id,
          order_id: order.id,
          product_id: product.id,
          quantity: updatedOrderItem.quantity,
          price: updatedOrderItem.price,
          name: updatedOrderItem.name,
        },
      ],
    })
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const orderRepository = new OrderRepository()
    const order = new Order('123', customer.id, [orderItem])
    await orderRepository.create(order)

    const foundOrder = await orderRepository.find(order.id)

    expect(foundOrder).toBeDefined()
    expect(foundOrder!.id).toBe(order.id)
    expect(foundOrder!.customerId).toBe(customer.id)
    expect(foundOrder!.items).toHaveLength(1)
    expect(foundOrder!.items[0].id).toBe(orderItem.id)
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem1 = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const orderItem2 = new OrderItem(
      '2',
      product.name,
      product.price,
      product.id,
      1,
    )

    const orderRepository = new OrderRepository()
    const order1 = new Order('123', customer.id, [orderItem1])
    const order2 = new Order('124', customer.id, [orderItem2])
    await orderRepository.create(order1)
    await orderRepository.create(order2)

    const foundOrders = await orderRepository.findAll()

    expect(foundOrders).toHaveLength(2)
    expect(foundOrders[0].id).toBe(order1.id)
    expect(foundOrders[1].id).toBe(order2.id)
  })
})
