import * as Nedb from 'nedb'
import { ISessionToken } from '../Server/Model';


export class SessionTokenDBAccess{
    private nedb: Nedb;

    constructor() { 
        this.nedb = new Nedb('database/SessionToken.db')
        this.nedb.loadDatabase()
    }

    public async putSessionToken(sessionToken:ISessionToken): Promise<void>{
        return new Promise((resolve,reject)=>{
            this.nedb.insert(sessionToken,(err:Error | null)=>{
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    public async getSessionToken(tokenId: string):Promise<ISessionToken | undefined> {
        return new Promise((resolve,reject)=>{
            this.nedb.find({tokenId: tokenId}, (err:Error, docs:any[] )=>{
                if (err) {
                    reject(err)
                } else {
                    if (docs.length == 0) {
                        resolve()
                    } else {
                        resolve(docs[0])
                    }
                }
            })
        })
    }
}