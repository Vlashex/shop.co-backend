export interface ITokens {
    access_token: string,
    refresh_token: string,
}
export interface IUser {
    id: number,
    
    email: string,
    password: string,

    name: string,
    cart: string[],
}
export interface IAuth {
    user: IUser,
    tokens: ITokens,
}