import type { RepositoryInterface } from '../../repository/repository.interface'
import type { Customer } from '../entity/customer'

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> {}
