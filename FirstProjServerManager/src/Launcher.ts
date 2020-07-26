import {Server} from './Server/Server'

class Launcher{
    //instance variables
    private server: Server;

    constructor() {
        this.server = new Server();
    }

    public launchApp(){
        console.log("App Started")
        this.server.createServer();
    }
    
}

new Launcher().launchApp()