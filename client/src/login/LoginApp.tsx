import * as React from "react";
import LoginForm from "./components/loginForm/LoginForm";
import {MuiThemeProvider} from "../../node_modules/@material-ui/core/styles/index";
import {CURRENT_THEME} from "../admin/AdminApp";
import ApplicationHolder from "../core/utils/ApplicationHolder";
import {ApplicationType} from "../core/enum/ApplicationType";
import LocaleHolder from "../core/utils/LocaleHolder";
import {DEFAULT_LOCALE} from "../core/enum/LocaleType";
import LoginApplicationController from "./controller/LoginApplicationController";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import TypedApplicationControllerHolder from "../core/utils/TypedApplicationControllerHolder";

export default class LoginApp extends React.Component<Properties, State> {

    private controller: LoginApplicationController

    constructor(props: Properties) {
        super(props);
        this.state = {
            isLoading: false,
        }
        ApplicationHolder.initialize(ApplicationType.Login)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = LoginApplicationController.instance
        TypedApplicationControllerHolder.initialize(this.controller)
    }

    render() {
        return <MuiThemeProvider theme={CURRENT_THEME}>
            <LoginForm controller={this.controller}/>
            <LoadingMoire visible={this.state.isLoading}/>
        </MuiThemeProvider>
    }

    componentDidMount(): void {
        this.controller.subscribe(this, {
            isApplicationLoading: "isLoading",
        })
    }

    componentWillUnmount(): void {
        this.controller.unsubscribe(this)
    }
}

type Properties = {}

type State = {
    isLoading: boolean,
}