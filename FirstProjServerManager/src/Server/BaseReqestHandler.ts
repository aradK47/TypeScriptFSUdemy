import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";
import { AccountInterface } from "./Model";


export abstract class BaseRequestHandler {

    protected req: IncomingMessage;
    protected res: ServerResponse;

    constructor(req: IncomingMessage, res: ServerResponse) {
        this.req = req;
        this.res = res;
    }

    abstract async handleRequest(): Promise<void>

    protected handleNotFound() {
        this.res.statusCode = HTTP_CODES.NOT_FOUND;
        this.res.write('Not Found')
    }

    protected respondJsonObject(code: HTTP_CODES, object: any) {
        this.res.writeHead(code, { 'Content-Type': 'application/json' })
        this.res.write(JSON.stringify(object))
    }

    protected respondBadRequest(message: string) {
        this.res.statusCode = HTTP_CODES.BAD_REQUEST;
        this.res.write(message)
    }

    protected respondUnauthorized(message: string) {
        this.res.statusCode = HTTP_CODES.UNAUTHORIZED;
        this.res.write(message)
    }

    protected respondText(httpCode: HTTP_CODES, message: string) {
        this.res.statusCode = httpCode;
        this.res.write(message)
    }


    // because it's a long time operation, we are - 
    // using the key word "async" because the reason above
    protected async getRequestBody(): Promise<any> {
        // returning a new Promise of type any
        return new Promise((resolve, reject) => {
            // and empty body that will be resolved evetually
            let body = '';
            // checking the onEvent -> this will happen if i get data from the request
            this.req.on('data', (data: string) => {
                // concatinating the data to the body prop
                body += data;
            });
            // checking if the event is 'end'
            this.req.on('end', () => {
                try {
                    // if the body is not null or undefind , it will create a json out of it and resolve it.
                    resolve(JSON.parse(body))
                } catch (error) {
                    // form of throwing error
                    reject(error);
                }
            });
            // if the event is error, it will reject, and throw an error
            this.req.on('error', (error: any) => {
                reject(error);
            })
        })
    }


}