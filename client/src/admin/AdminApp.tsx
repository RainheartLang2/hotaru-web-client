import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import UserListPage from "./components/userlist/UserListPage";
import AdminAppController from "./controller/AdminAppController";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import AdminDialogsContainer from "./containers/AdminDialogsContainer";
import {ApplicationType} from "../core/enum/ApplicationType";
import ApplicationHolder from "../core/utils/ApplicationHolder";
import LocaleHolder from "../core/utils/LocaleHolder";
import {DEFAULT_LOCALE} from "../core/enum/LocaleType";
import ErrorModal from "../core/components/errrorModal/ErrorModal";
import {AdminStateProperty} from "./state/AdminApplicationState";
import ApplicationControllerHolder from "../core/utils/ApplicationControllerHolder";
import ApplicationHeader from "../common/components/applicationHeader/ApplicationHeader";
import {Employee} from "../common/beans/Employee";
import {log} from "util";
import AdminPagesContainer from "./components/pages/AdminPagesContainer";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import NavigationMenu from "./components/navigationMenu/NavigationMenu";

export let CURRENT_THEME: Theme = vetTheme;

export default class AdminApp extends React.Component<Properties, State> {

    private controller: AdminAppController

    constructor(props: Properties) {
        super(props);
        this.state = {
            [StateProperty.IsLoading]: true,
            [StateProperty.LoggedInUser]: null,
        }
        ApplicationHolder.initialize(ApplicationType.Admin)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = AdminAppController.instance
        ApplicationControllerHolder.initialize(this.controller)
    }

    render() {
        const loggedInUser = this.state[StateProperty.LoggedInUser] as Employee | null
        return (
            <MuiThemeProvider theme={CURRENT_THEME}>
                <ApplicationHeader
                    userName={loggedInUser ? (loggedInUser.lastName + " " + loggedInUser.firstName) : ""}
                    onLogOutClick={() => this.controller.logout()}
                    onUserNameClick={() => {
                        if (loggedInUser) {
                            this.controller.employeeActions.openEditEmployeeDialog(loggedInUser, true)
                        }
                    }}>
                    <NavigationMenu controller={this.controller}/>
                </ApplicationHeader>
                <AppContent visible={!this.state.isLoading}>
                    <AdminPagesContainer controller={this.controller}/>
                </AppContent>
                <AdminDialogsContainer/>
                <LoadingMoire visible={this.state.isLoading}/>
                <ErrorModal controller={this.controller}/>
                <Footer/>
            </MuiThemeProvider>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(AdminStateProperty.IsApplicationLoading, this, StateProperty.IsLoading)
        this.controller.subscribe(AdminStateProperty.LoggedInEmployee, this, StateProperty.LoggedInUser)
        this.controller.startApplication()
    }
}

enum StateProperty {
    IsLoading = "isLoading",
    LoggedInUser = "loggedInUser",
}

type Properties = {}

type State = {
    [StateProperty.IsLoading]: boolean,
    [StateProperty.LoggedInUser]: Employee | null,
}