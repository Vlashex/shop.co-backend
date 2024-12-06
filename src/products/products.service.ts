import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private readonly usersRepository: Repository<Product>,
    private readonly storageService: StorageService
  ) {}

  async create(CreateProductDto: CreateProductDto) {

    const date = Date.now()

    const { images } = CreateProductDto;

    const uploadedImages:string[] = [];
    for (const base64Image of images) {
      const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const uploadedImage = await this.storageService.uploadFromBuffer(buffer);
      uploadedImages.push(uploadedImage.url); 
    }

    const newProduct = this.usersRepository.create({...CreateProductDto,
      createdAt: String(date),
      images: uploadedImages,
      previousPrice: Math.round(CreateProductDto.price * 1.1)
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
