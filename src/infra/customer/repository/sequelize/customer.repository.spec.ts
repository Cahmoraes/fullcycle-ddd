import { Sequelize } from 'sequelize-typescript'
import { Address } from '../../../../domain/entity/address'
import { Customer } from '../../../../domain/entity/customer'
import { CustomerModel } from './customer.model'
import { CustomerRepository } from './customer.repository'

describe('Customer repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    await sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address
    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel!.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address
    await customerRepository.create(customer)

    customer.changeName('Customer 2')
    await customerRepository.update(customer)
    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel!.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address
    await customerRepository.create(customer)

    const customerResult = await customerRepository.find(customer.id)

    expect(customerResult).toMatchObject({
      _id: '123',
      _name: 'Customer 1',
      _active: false,
      _rewardPoints: 0,
      _address: {
        _street: 'Street 1',
        _number: 1,
        _zip: 'Zipcode 1',
        _city: 'City 1',
      },
    })
  })

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()

    await expect(async () => {
      await customerRepository.find('456ABC')
    }).rejects.toThrow('Customer not found')
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()
    const customer1 = new Customer('123', 'Customer 1')
    const address1 = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer1.address = address1
    customer1.addRewardPoints(10)
    customer1.activate()

    const customer2 = new Customer('456', 'Customer 2')
    const address2 = new Address('Street 2', 2, 'Zipcode 2', 'City 2')
    customer2.address = address2
    customer2.addRewardPoints(20)

    await customerRepository.create(customer1)
    await customerRepository.create(customer2)

    const customers = await customerRepository.findAll()

    expect(customers).toHaveLength(2)
    expect(customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: '123',
          _name: 'Customer 1',
          _active: true,
          _rewardPoints: 10,
          _address: expect.objectContaining({
            _street: 'Street 1',
            _number: 1,
            _zip: 'Zipcode 1',
            _city: 'City 1',
          }),
        }),
        expect.objectContaining({
          _id: '456',
          _name: 'Customer 2',
          _active: false,
          _rewardPoints: 20,
          _address: expect.objectContaining({
            _street: 'Street 2',
            _number: 2,
            _zip: 'Zipcode 2',
            _city: 'City 2',
          }),
        }),
      ]),
    )
  })
})
