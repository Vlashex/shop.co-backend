import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private usersRepository: Repository<Product>,
  ) {}

  async create(CreateProductDto: CreateProductDto) {

    const date = Date.now()

    const newProduct = this.usersRepository.create({...CreateProductDto,
      createdAt: String(date)
    });

    const savedProducts = await this.usersRepository.save(newProduct);

    return {
      title: "Product created",
      product: newProduct
    };
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({
      id: id
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.usersRepository.update({
      id: id,
    }, updateProductDto);
  }

  remove(id: number) {
    return this.usersRepository.delete({
      id: id
    })
  }
}
