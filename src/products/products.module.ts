import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProviders } from './products.providers';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...productsProviders,
    ProductsService
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
