import ApplicationController from "../../core/mvc/ApplicationController";
import LoginApplicationState from "../state/LoginApplicationState";

export default class LoginApplicationController extends ApplicationController {
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
}