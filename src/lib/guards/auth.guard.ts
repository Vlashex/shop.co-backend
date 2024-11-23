import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { jwtVerify, generateSecret } from "jose";



@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const secret = process.env.SECRET_KEY;

        console.log(secret)

        if (secret == undefined) return false;
        
        try {
            const secretKey = new TextEncoder().encode(secret)

            const request:Request = context.switchToHttp().getRequest();
        
            const token:Uint8Array = new TextEncoder().encode(request.headers.authorization);
            
            const isAccessTokenValid = await jwtVerify(token, secretKey)

            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }
}