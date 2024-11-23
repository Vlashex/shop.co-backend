import { Product } from 'src/products/entities/product.entity';
import { Users } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: Number(process.env.DB_PORT),
        username: (process.env.DB_USER_NAME as string),
        password: (process.env.DB_USER_PASSWORD as string),
        database: (process.env.DB_NAME as string),
        entities: [
          Users, 
          Product, 
          __dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

