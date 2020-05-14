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
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import {LoginStateProperty} from "./state/LoginApplicationState";
import TestApplicationStore from "../core/mvc/store/TestApplicationStore";

export default class LoginApp extends React.Component<Properties, State> {

    private controller: LoginApplicationController

    constructor(props: Properties) {
        super(props);
        this.state = {
            [StateProperty.IsLoading]: false,
        }
        ApplicationHolder.initialize(ApplicationType.Login)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = LoginApplicationController.instance
        ApplicationControllerHolder.initialize(this.controller)

        const testStore = new TestApplicationStore()
        testStore.setState({
            testProperty: "1",
            firstNumber: 1,
            secondNumber: 3,
        })
    }

    render() {
        return <MuiThemeProvider theme={CURRENT_THEME}>
            <LoginForm controller={this.controller}/>
            <LoadingMoire visible={this.state[StateProperty.IsLoading]}/>
        </MuiThemeProvider>
    }

    componentDidMount(): void {
        this.controller.subscribe(LoginStateProperty.IsApplicationLoading, this, StateProperty.IsLoading)
    }

    componentWillUnmount(): void {
        this.controller.unsubscribe(this)
    }
}

enum StateProperty {
    IsLoading = "isLoading"
}

type Properties = {}

type State = {
    [StateProperty.IsLoading]: boolean,
}