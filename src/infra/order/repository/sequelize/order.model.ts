import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript'
import { CustomerModel } from '../../../customer/repository/sequelize/customer.model'
import { OrderItemModel } from './order-item.model'

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string

  @ForeignKey(() => CustomerModel)
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare customer_id: string

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel

  @HasMany(() => OrderItemModel, { foreignKey: 'order_id', as: 'items' })
  declare items: OrderItemModel[]

  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
  declare total: number
}
