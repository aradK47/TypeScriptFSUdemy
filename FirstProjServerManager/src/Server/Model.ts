import { AccessRight } from "../Shared/Model";


export interface AccountInterface {
    username:string;
    password:string;
}

export interface ISessionToken{
    tokenId:string,
    username: string, 
    valid:boolean,
    expirationTime:Date,
    accessRights: AccessRight[]
}

export interface ITokenGenerator{
    generateToken(account:AccountInterface): Promise<ISessionToken | undefined>
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED,
}

export interface ITokenRights{
    accessRights: AccessRight[],
    state: TokenState
}

export interface ITokenValidator {
    validateToken(tokenId: string): Promise<ITokenRights>;
}