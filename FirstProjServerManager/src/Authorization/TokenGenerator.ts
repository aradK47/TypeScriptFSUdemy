import { ITokenGenerator, AccountInterface , ISessionToken, ITokenValidator, ITokenRights, TokenState} from "../Server/Model";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";


// creates and stores the token in the token database
export class TokenGenerator implements ITokenGenerator, ITokenValidator{

    // getting access to the database
    private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    // getting acces to the token database
    private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess();

    // async method that generates the token.
    async generateToken(account: AccountInterface): Promise<ISessionToken | undefined> {
        // invoking the method that checks if the credentials are right.
        // we pass it a username and password
        // this returns ISessionToken object, that returns to the const from the getUserCredentials method
        const resultAccount = await this.userCredDBAccess.getUserCredential(account.username,account.password);
        // if the result code exists
        if (resultAccount) {
            // creating a token accoriding to the ISesstionToken structure
            const token: ISessionToken = {
                accessRights: resultAccount.accessRights,
                expirationTime: this.generateExpirationTime(),
                username: resultAccount.username,
                valid: true,
                tokenId: this.generateRandomTokenId()
            }
            // after the token is created, we put it in the token db.
            await this.sessionTokenDBAccess.putSessionToken(token);
            return token
        } else {
            return undefined
        }
    }

    public async validateToken(tokenId: string): Promise<ITokenRights>{
        const token = await this.sessionTokenDBAccess.getSessionToken(tokenId)
        if (!token || !token.valid) {
            return {
                accessRights: [],
                state: TokenState.INVALID
            }
        } else if (token.expirationTime < new Date() ) {
            return {
                accessRights:[],
                state: TokenState.EXPIRED
            }
        } else { 
            return {
                accessRights: token.accessRights,
                state: TokenState.VALID
            }
        }
    }

    private generateExpirationTime(){
        return new Date(Date.now() * 60 * 60 * 1000);
    }

    private generateRandomTokenId(){
        return Math.random().toString(36).slice(2);
    }
}