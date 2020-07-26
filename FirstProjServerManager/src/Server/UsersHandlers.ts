import { ITokenGenerator, ITokenValidator } from "./Model";
import { IncomingMessage, ServerResponse } from "http";
import { UserDBAccess } from "../User/UsersDBAccess";
import { HTTP_METHODS, HTTP_CODES, AccessRight } from "../Shared/Model";
import { Utils } from "./Utils";
import { BaseRequestHandler } from "./BaseReqestHandler";

export class UsersHandler extends BaseRequestHandler {

    private userDBAccess: UserDBAccess = new UserDBAccess();
    private tokenvalidator: ITokenValidator;

    constructor(req: IncomingMessage, res: ServerResponse, tokenvalidator: ITokenValidator) {
        super(req, res)
        this.tokenvalidator = tokenvalidator;
    }

    async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;

            default:
                this.handleNotFound();
                break;
        }
    }
    private async handleGet() {
        const parsedUrl = Utils.getUrlParameters(this.req.url);
        if (parsedUrl) {
            const userId = parsedUrl?.query.id;
            if (userId) {
                const user = await this.userDBAccess.getUserById(userId as string);
                if ( user ) {
                    this.respondJsonObject(HTTP_CODES.OK, user)
                } else {
                    this.handleNotFound()
                }
            } else {
                this.respondBadRequest("userId not present in request")
            }
        }
    }

    public async operationAuthorized(operation: AccessRight):Promise<boolean>{
        const tokenId = this.req.headers.authorization;
        if (tokenId) {
            const tokenRights = await this.tokenvalidator.validateToken(tokenId)
            if (tokenRights.accessRights.includes(operation)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}