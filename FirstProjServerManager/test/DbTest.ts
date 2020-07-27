import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { UserDBAccess } from "../src/User/UsersDBAccess";
import { WorkingPosition } from "../src/Shared/Model";


class DbTest{
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    public userDBAccess: UserDBAccess = new UserDBAccess();
}

new DbTest().dbAccess.putUserCredentials({
    username:'user3',
    password:'password3',
    accessRights:[0,1,2,3]
});

new DbTest().userDBAccess.putUser({
    age:30,
    name:"sh",
    workingPosition: WorkingPosition.JUNIOR,
    id: 'mapleaple',
    email:"test@test.com"
})