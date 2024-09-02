import { Order } from '../../../../domain/entity/order'
import { OrderItem } from '../../../../domain/entity/order-item'
import { OrderModel } from './order.model'
import { OrderItemModel } from './order-item.model'

export class OrderRepository {
  async create(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    )
  }

  async update(order: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: order.customerId,
        total: order.total(),
      },
      {
        where: {
          id: order.id,
        },
      },
    )

    // Atualiza ou recria os itens do pedido
    await OrderItemModel.destroy({
      where: {
        order_id: order.id,
      },
    })

    await OrderItemModel.bulkCreate(
      order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: order.id,
      })),
    )
  }

  async find(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findOne({
      where: {
        id,
      },
      include: [{ model: OrderItemModel, as: 'items' }],
    })

    if (!orderModel) {
      return null
    }

    const items = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      )
    })

    return new Order(orderModel.id, orderModel.customer_id, items)
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel, as: 'items' }],
    })

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        )
      })

      return new Order(orderModel.id, orderModel.customer_id, items)
    })
  }
}
