import { Address } from '../../../../domain/entity/address'
import { Customer } from '../../../../domain/entity/customer'
import type CustomerRepositoryInterface from '../../../../domain/repository/customer-repository.interface'
import { CustomerModel } from './customer.model'

export class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipcode: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    })
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zip,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      },
    )
  }

  async find(id: string): Promise<Customer> {
    const customerModel = await this.customerModelByIdOrThrow(id)
    const customer = new Customer(id, customerModel.name)
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city,
    )
    customer.changeAddress(address)
    return customer
  }

  private async customerModelByIdOrThrow(id: string): Promise<CustomerModel> {
    try {
      const customerModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      })
      return customerModel
    } catch {
      throw new Error('Customer not found')
    }
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll()
    const customers = customerModels.map((customerModels: any) => {
      const customer = new Customer(customerModels.id, customerModels.name)
      customer.addRewardPoints(customerModels.rewardPoints)
      const address = new Address(
        customerModels.street,
        customerModels.number,
        customerModels.zipcode,
        customerModels.city,
      )
      customer.changeAddress(address)
      if (customerModels.active) customer.activate()
      return customer
    })
    return customers
  }
}
