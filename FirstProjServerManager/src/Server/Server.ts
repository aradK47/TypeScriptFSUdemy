import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Utils } from './Utils';
import { LoginHandler } from './LoginHandler';
import { TokenGenerator } from '../Authorization/TokenGenerator';
import { ITokenGenerator } from './Model';
import { UsersHandler } from './UsersHandlers';

export class Server {

    private tokenGenerator: TokenGenerator  =  new TokenGenerator();

    public createServer(){
        createServer(
            async (req: IncomingMessage , res: ServerResponse)=>{
                console.log('got request from: ' + req.url);
                const basePath = Utils.getUrlBasePath(req.url);
        
                switch (basePath) {
                    case "login":
                        await new LoginHandler(req,res, this.tokenGenerator).handleRequest()
                        break;
                    case "users":
                        await new UsersHandler(req,res,this.tokenGenerator).handleRequest()
                        break;
                    default:
                        break;
                }

                res.end()
        }).listen(8080)
        console.log('server started')
    }

}
