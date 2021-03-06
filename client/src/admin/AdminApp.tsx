import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import AdminDialogsContainer from "./containers/AdminDialogsContainer";
import {ApplicationType} from "../core/enum/ApplicationType";
import ApplicationHolder from "../core/utils/ApplicationHolder";
import LocaleHolder from "../core/utils/LocaleHolder";
import {DEFAULT_LOCALE} from "../core/enum/LocaleType";
import ErrorModal from "../core/components/errrorModal/ErrorModal";
import ApplicationHeader from "../common/components/applicationHeader/ApplicationHeader";
import {Employee} from "../common/beans/Employee";
import AdminPagesContainer from "./components/pages/AdminPagesContainer";
import NavigationMenu from "./components/navigationMenu/NavigationMenu";
import {AdminSecondLevelNavigationContainer} from "./components/secondLevelNavigation/AdminSecondLevelNavigationContainer";
import ApplicationControllerHolder from "../core/utils/ApplicationControllerHolder";
import EmployeeAppController from "./controller/EmployeeAppController";
import EmployeeLeftMenuContainer from "./containers/EmployeeLeftMenuContainer";
import EmployeeRightPanelContainer from "./containers/EmployeeRightPanelContainer";
import CheckingStateComponent from "../core/components/CheckingStateComponent";

export let CURRENT_THEME: Theme = vetTheme;

export default class AdminApp extends CheckingStateComponent<Properties, State> {

    private controller: EmployeeAppController

    constructor(props: Properties) {
        super(props);
        this.state = {
            isLoading: true,
            loggedInUser: null,
            leftMenuVisible: false,
        }
        ApplicationHolder.initialize(ApplicationType.Admin)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = EmployeeAppController.instance
        ApplicationControllerHolder.initialize(this.controller)
    }

    render() {
        const loggedInUser = this.state.loggedInUser as Employee | null
        return (
            <MuiThemeProvider theme={CURRENT_THEME}>
                <ApplicationHeader
                    userName={loggedInUser ? (loggedInUser.lastName + " " + loggedInUser.firstName) : ""}
                    onLogOutClick={() => this.controller.logout()}
                    onUserNameClick={() => {
                        if (loggedInUser) {
                            this.controller.employeeActions.openEditEmployeeDialog(loggedInUser, true)
                        }
                    }}
                    controller={this.controller}
                >
                    <NavigationMenu controller={this.controller}/>
                </ApplicationHeader>
                <AppContent
                    leftMenuContainer={<EmployeeLeftMenuContainer controller={this.controller}/>}
                    leftMenuVisible={this.state.leftMenuVisible}
                    pageVisible={!this.state.isLoading}
                >
                    <AdminPagesContainer controller={this.controller}/>
                </AppContent>
                <AdminDialogsContainer controller={this.controller}/>
                <LoadingMoire visible={this.state.isLoading} fading={true}/>
                <EmployeeRightPanelContainer controller={this.controller}/>
                <ErrorModal controller={this.controller}/>
                <Footer/>
            </MuiThemeProvider>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(this, {
            isApplicationLoading: "isLoading",
            loggedInEmployee: "loggedInUser",
            showSecondLevelNavigationMenu: "leftMenuVisible",
        })
        this.controller.startApplication()
    }

    componentWillUnmount(): void {
        this.controller.unsubscribe(this)
    }
}

type Properties = {}

type State = {
    isLoading: boolean,
    loggedInUser: Employee | null,
    leftMenuVisible: boolean,
}