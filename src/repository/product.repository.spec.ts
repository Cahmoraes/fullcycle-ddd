import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../infra/db/sequelize/model/product.model'
import { ProductRepository } from './product.repository'
import { OrderItemModel } from '../infra/order/repository/sequelize/order-item.model'
import { Product } from '../domain/entity/product'
import { OrderModel } from '../infra/order/repository/sequelize/order.model'
import { CustomerModel } from '../infra/customer/repository/sequelize/customer.model'

describe('Product repository unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([
      ProductModel,
      OrderItemModel,
      OrderModel,
      CustomerModel,
    ])
    await sequelize.sync()
  })

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 100)
    await productRepository.create(product)
    const productModel = await ProductModel.findOne({ where: { id: '1' } })
    expect(productModel!.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100,
    })
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 100)
    await productRepository.create(product)
    product.changeName('Product 2')
    product.changePrice(200)
    await productRepository.update(product)
    const productModel2 = await ProductModel.findOne({ where: { id: '1' } })
    expect(productModel2!.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 2',
      price: 200,
    })
  })

  it('should find a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 100)
    await productRepository.create(product)
    const productModel = await ProductModel.findOne({ where: { id: '1' } })
    const foundProduct = await productRepository.find('1')
    expect(productModel!.toJSON()).toStrictEqual({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price,
    })
    expect(productModel!.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100,
    })
  })

  it('should find all products', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 100)
    const product2 = new Product('2', 'Product 2', 200)
    await productRepository.create(product)
    await productRepository.create(product2)
    const foundProducts = await productRepository.findAll()
    const products = [product, product2]
    expect(foundProducts).toEqual(products)
  })

  afterEach(async () => {
    await sequelize.close()
  })
})
