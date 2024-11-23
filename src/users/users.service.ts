
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { SignJWT } from 'jose';
import { User } from './users.controller';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }
  async findOneByCredentials(email:string, password: string): Promise<Users | null> {
    
    const user = await this.usersRepository.findOneBy({
      email: email,
      password: password
    })
    
    return user || null
  }
  async isUserAllreadyExistByEmail(email:string): Promise<boolean> {
    
    const user = await this.usersRepository.findOneBy({
      email: email
    })
    
    return !!user
  }
  async createTokens(userId: number) {
    const secret = process.env.SECRET_KEY as string
    const secretKey = new TextEncoder().encode(secret)

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60 * 24 * 7;

    return {
      user_id: userId,
      access_token: await new SignJWT({userId})
      .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
      .setExpirationTime( exp  )
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(secretKey),
      refresh_token: await new SignJWT({userId})
      .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
      .setExpirationTime( exp*4)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(secretKey),
    }; 
  }

  async create(param:User) {

    try {
      return this.usersRepository.create(param);
    } catch (err) {
      console.log(err)
    }
  }
  async save(entity) {
    try {
      return this.usersRepository.save(entity)
    } catch (err) {
      console.log(err)
    }
  }
}
