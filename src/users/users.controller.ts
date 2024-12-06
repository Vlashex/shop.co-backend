import { Body, Controller, Get, HttpException, HttpStatus, Post, RawBody, Req, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginSchema, RegisterSchema } from 'src/lib/userSchema';
import { ZodValidationPipe } from './user.validationpipe';

export interface User {
    id: number,
    email: string,
    password: string,
    name: string,
    cart: string[]
}
interface Tokens {
    access_token: string,
    refresh_token: string
}
interface Auth {
    user: User
    tokens: Tokens
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Post('/signin')
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async findOneByCredentials(@Body() body : {email: string, password: string}): Promise<Auth> {
        const {email, password} = body
        const user = await this.usersService.findOneByCredentials(email, password)

        console.log(await this.usersService.findOneByCredentials(email, password))
        console.log(email, password)

        if (user == null)
            throw new HttpException('Incorrect login or password', HttpStatus.FORBIDDEN)

        const tokens = await this.usersService.createTokens(user.id)

        return {
            user,
            tokens
        }
    }

    @Post('/signup')
    @UsePipes(new ZodValidationPipe(RegisterSchema))
    async create(@Body() body: User):Promise<Auth> {

        const isUserAllreadyExist = await this.usersService.isUserAllreadyExistByEmail(body.email)

        if (isUserAllreadyExist)
            throw new HttpException('User is allready exist', HttpStatus.FORBIDDEN)

        const newUser = await this.usersService.create(body);

        await this.usersService.save(newUser);

        const tokens = await this.usersService.createTokens(newUser.id)
        
        return {
            user: newUser,
            tokens: tokens
        };
    }
}
