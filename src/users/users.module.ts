import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { usersProviders } from './user.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...usersProviders,
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
