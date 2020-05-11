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
        this.setPropertyValue(LoginStateProperty.IsLoginButtonLoading, true)
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogin,
            params: [login.loginName, login.password],
            successCallback: (result: any) => {
                this.setPropertyValue(LoginStateProperty.IsLoginButtonLoading, false)
                this.applicationStore.setPropertyValue(LoginStateProperty.IsApplicationLoading, false)
                window.location.href = result
            },
            errorCallback: () => this.setPropertyValue(LoginStateProperty.IsLoginButtonLoading, false),
            errorProperty: LoginStateProperty.HasError,
        })
    }

    handleUnauthorizedUserSituation(): void {
        throw new Error("Unauthorized User situation is impossible, since login app does not require autentication")
    }

    getDialogSubmitButtonPropertyName(): string {
        throw new Error("Unsupported operation")
    }
}