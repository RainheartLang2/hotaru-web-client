import ApplicationStore from "../../core/mvc/store/ApplicationStore";
import {Login} from "../../common/beans/Login";

export default class LoginApplicationState extends ApplicationStore {
    private static _instance: LoginApplicationState

    public static get instance(): LoginApplicationState {
        if (!LoginApplicationState._instance) {
            LoginApplicationState._instance = new LoginApplicationState()
        }
        return LoginApplicationState._instance
    }

    private constructor() {
        super()
        this.registerProperty(LoginStateProperty.HasError, "")
        this.registerProperty(LoginStateProperty.IsApplicationLoading, false)
        this.registerProperty(LoginStateProperty.IsLoginButtonLoading, false)
        this.registerField(LoginStateProperty.Login, "")
        this.registerField(LoginStateProperty.Password, "")
        this.registerSelector(LoginStateProperty.IsAllowedToSubmit, {
            dependsOn: [LoginStateProperty.Login, LoginStateProperty.Password],
            get: map => {
                return !!map.get(LoginStateProperty.Login).value && !!map.get(LoginStateProperty.Password).value
            }
        })
    }

    public buildLogin(): Login {
        return {
            loginName: this.getFieldValue(LoginStateProperty.Login),
            password: this.getFieldValue(LoginStateProperty.Password),
        }
    }

    public setLogicError(errorKey: string): void {
        this.setPropertyValue(LoginStateProperty.HasError, errorKey)
    }
}

export enum LoginStateProperty {
    HasError = "hasError",
    IsApplicationLoading = "isLoading",
    IsLoginButtonLoading = "isLoginButtonLoading",
    Login = "login",
    Password = "password",
    IsAllowedToSubmit = "isAllowedToSubmit",
}