import type { Product } from '../domain/entity/product'
import type { RepositoryInterface } from './repository.interface'

export interface ProductRepositoryInterface
  extends RepositoryInterface<Product> {}
