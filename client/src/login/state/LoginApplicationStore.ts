import {Login} from "../../common/beans/Login";
import TypedApplicationStore, {Derivatives} from "../../core/mvc/store/TypedApplicationStore";
import {Field} from "../../core/mvc/store/Field";
import RequiredFieldValidator from "../../core/mvc/validators/RequiredFieldValidator";

export default class LoginApplicationStore extends TypedApplicationStore<LoginState, LoginDerivationState> {
    private static _instance: LoginApplicationStore

    public static get instance(): LoginApplicationStore {
        if (!LoginApplicationStore._instance) {
            LoginApplicationStore._instance = new LoginApplicationStore()
        }
        return LoginApplicationStore._instance
    }

    public buildLogin(): Login {
        return {
            loginName: this.state.loginField.value,
            password: this.state.passwordField.value,
        }
    }

    protected getDefaultDerivatives(): Derivatives<LoginState, LoginDerivationState> {
        return {
            loginField: this.createField("login", "", [new RequiredFieldValidator()]),
            passwordField: this.createField("password", "", [new RequiredFieldValidator()]),
            isAllowedToSubmit: {
                dependsOn: ["loginField", "passwordField"],
                get: (args: Pick<LoginState & LoginDerivationState, "loginField" | "passwordField">) => args.loginField.value && args.passwordField.value,
                value: false,
            }
        };
    }

    protected getDefaultState(): LoginState {
        return {
            hasError: "",
            isApplicationLoading: true,
            isLoginButtonLoading: false,
            login: "",
            password: "",
        };
    }
}

export type LoginState = {
    hasError: string
    isApplicationLoading: boolean
    isLoginButtonLoading: boolean,
    login: string,
    password: string,
}

export type LoginDerivationState = {
    loginField: Field,
    passwordField: Field,
    isAllowedToSubmit: boolean,
}