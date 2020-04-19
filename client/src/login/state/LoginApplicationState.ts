import ApplicationStore from "../../core/mvc/store/ApplicationStore";

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
        this.registerProperty(LoginStateProperty.IsApplicationLoading, true)
        this.registerField(LoginStateProperty.Login, "")
        this.registerField(LoginStateProperty.Password, "")
        this.registerSelector(LoginStateProperty.IsAllowedToSubmit, {
            dependsOn: [LoginStateProperty.Login, LoginStateProperty.Password],
            get: map => {
                return !!map.get(LoginStateProperty.Login).value && !!map.get(LoginStateProperty.Password).value
            }
        })
    }
}

export enum LoginStateProperty {
    IsApplicationLoading = "isLoading",
    Login = "login",
    Password = "password",
    IsAllowedToSubmit = "isAllowedToSubmit",
}