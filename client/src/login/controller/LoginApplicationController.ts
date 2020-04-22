import ApplicationController from "../../core/mvc/ApplicationController";
import LoginApplicationState, {LoginStateProperty} from "../state/LoginApplicationState";
import {fetchPreloginRpc} from "../../core/utils/HttpUtils";
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
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogin,
            params: [login.loginName, login.password],
            successCallback: (result: any) => window.location.href = result,
            setError: (errorType: string) => this.applicationStore.setPropertyValue(LoginStateProperty.HasError, errorType)
        })
    }
}