import ApplicationController from "../../core/mvc/ApplicationController";
import LoginApplicationState, {LoginStateProperty} from "../state/LoginApplicationState";
import {extractData, fetchPreloginRpc} from "../../core/utils/HttpUtils";
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
        this.applicationStore.setPropertyValue(LoginStateProperty.HasError, "")
        const login = this.applicationStore.buildLogin()
        fetchPreloginRpc(RemoteMethods.employeeLogin,
            [login.loginName, login.password]
        ).then(result => {
            window.location.href = extractData(result)
        }).catch(error => {
            this.errorHandler.handle(error, LoginStateProperty.HasError)
        })
    }
}