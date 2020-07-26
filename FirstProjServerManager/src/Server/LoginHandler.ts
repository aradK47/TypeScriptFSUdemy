import { IncomingMessage, ServerResponse } from "http";
import { AccountInterface,  ITokenGenerator } from "./Model";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { BaseRequestHandler } from "./BaseReqestHandler"; 

export class LoginHandler extends BaseRequestHandler {
    
    // interface for generating a token
    private tokenGenerator: ITokenGenerator;

    constructor(req: IncomingMessage, res: ServerResponse, tokenGenerator: ITokenGenerator) {
        super(req,res)
        // ITokenGenerator that's passed from the Server.ts
        this.tokenGenerator = tokenGenerator;
    }

    // and implmented Method from the IHandler interface
    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.POST:
                await this.handlePost()
                break;
            default:
                this.handleNotFound()
                break;
        }
    }

    private async handlePost() {
        try {
            // returns an "AccountInterface" object
            const body: AccountInterface = await this.getRequestBody();
            // returns an a ISessionToken
            const sessionToken = await this.tokenGenerator.generateToken(body);
            if (sessionToken) {
                this.res.statusCode = HTTP_CODES.CREATED;
                this.res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
                this.res.write(JSON.stringify(sessionToken))
            } else {
                this.res.statusCode = HTTP_CODES.NOT_FOUND;
                this.res.write('Wrong user name or password')
            }
        } catch (error) {
            this.res.write("error: " + error.message)
        }
    }

    
}