import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany,
} from 'sequelize-typescript'
import { OrderItemModel } from '../../../order/repository/sequelize/order-item.model'

@Table({
  tableName: 'products',
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string

  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
  declare price: number

  @HasMany(() => OrderItemModel, { foreignKey: 'product_id' })
  declare orderItems: OrderItemModel[]
}
