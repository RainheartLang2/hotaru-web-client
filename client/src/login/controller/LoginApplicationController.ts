import LoginApplicationStore, {LoginDerivationState, LoginState} from "../state/LoginApplicationStore";
import {fetchPreloginRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import ApplicationController from "../../core/mvc/controllers/ApplicationController";

export default class LoginApplicationController extends ApplicationController<LoginState, LoginDerivationState, LoginApplicationStore> {
    private static _instance: LoginApplicationController

    private constructor() {
        super(LoginApplicationStore.instance)
    }

    public static get instance(): LoginApplicationController {
        if (!LoginApplicationController._instance) {
            LoginApplicationController._instance = new LoginApplicationController()
        }
        return LoginApplicationController._instance
    }

    public submitLoginForm(): void {
        const login = this.store.buildLogin()
        this.setState({isLoginButtonLoading: true})
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogin,
            params: [login.loginName, login.password],
            successCallback: (result: any) => {
                this.setState({isLoginButtonLoading: false, isApplicationLoading: false})
                window.location.href = result
            },
            errorCallback: (errorMessage: string) => {
                this.setState({isLoginButtonLoading: false})
            },
        })
    }

    handleUnauthorizedUserSituation(): void {
        throw new Error("Unauthorized User situation is impossible, since login app does not require autentication")
    }

    getDialogSubmitButtonPropertyName(): "isDialogSubmitButtonLoading" | "globalErrorTextKey" {
        throw new Error("Unsupported operation")
    }
}