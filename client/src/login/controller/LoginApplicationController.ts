import ApplicationController from "../../core/mvc/ApplicationController";
import LoginApplicationState from "../state/LoginApplicationState";
import {fetchRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";

export default class LoginApplicationController extends ApplicationController<LoginApplicationState> {
    private static _instance: LoginApplicationController

    private constructor() {
        super(LoginApplicationState.instance)
    }

    public static get instance(): LoginApplicationController {
        if (!LoginApplicationController._instance) {
            LoginApplicationController._instance = new LoginApplicationController()
        }
        return LoginApplicationController._instance
    }

    public submitLoginForm(): void {
        const login = this.applicationStore.buildLogin()
        fetchRpc(RemoteMethods.employeeLogin,
            [login.loginName, login.password]
        ).then(result => {
            console.log(result)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }
}