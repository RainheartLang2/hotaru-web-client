import * as React from "react";
import LoginForm from "./components/loginForm/LoginForm";
import {MuiThemeProvider} from "../../node_modules/@material-ui/core/styles/index";
import {CURRENT_THEME} from "../admin/AdminApp";
import ApplicationHolder from "../core/utils/ApplicationHolder";
import {ApplicationType} from "../core/enum/ApplicationType";
import LocaleHolder from "../core/utils/LocaleHolder";
import {DEFAULT_LOCALE} from "../core/enum/LocaleType";
import LoginApplicationController from "./controller/LoginApplicationController";
import ApplicationControllerHolder from "../core/utils/ApplicationControllerHolder";

export default class LoginApp extends React.Component<Properties, State> {

    private controller: LoginApplicationController

    constructor(props: Properties) {
        super(props);
        this.state = {
            [StateProperty.IsLoading]: true,
        }
        ApplicationHolder.initialize(ApplicationType.Login)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = LoginApplicationController.instance
        ApplicationControllerHolder.initialize(this.controller)
    }

    render() {
        return <MuiThemeProvider theme={CURRENT_THEME}>
            <LoginForm controller={this.controller}/>
        </MuiThemeProvider>
    }
}

enum StateProperty {
    IsLoading = "isLoading"
}

type Properties = {}

type State = {
    [StateProperty.IsLoading]: boolean,
}