import { IUserCredentials } from "../Shared/Model";
import * as Nedb from 'nedb'

export class UserCredentialsDBAccess{

    private nedb: Nedb;

    constructor() {
         this.nedb = new Nedb('database/UserCredentials.db');   
         this.nedb.loadDatabase();
    }

    public async putUserCredentials(userCredentials: IUserCredentials): Promise<any> {
        console.log(userCredentials)
        return new Promise((resolve,reject)=>{
            this.nedb.insert(userCredentials, (error:Error | null, docs:any)=>{
                if (error) {
                    reject(error)
                } else {
                    resolve(docs)
                }
            })
        })
    }

    // checking the user credentials against the DB
    public async getUserCredential(username:string, password:string):Promise<IUserCredentials | undefined>{
        return new Promise((resolve,reject)=>{
            this.nedb.find({username:username, password:password} , (err:Error | null, docs: IUserCredentials[])=>{
                if (err) {
                    reject(err)
                } else {
                    // the docs are empty
                    if (docs.length == 0) {
                        resolve(undefined)
                    } else {
                        resolve(docs[0])
                    }
                }
            })
        })
    }

} 