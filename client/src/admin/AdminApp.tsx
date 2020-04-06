import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import {AppHeader, TabComponent} from "../core/components";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import UserListPage from "./components/userlist/UserListPage";
import AdminAppController from "./controller/AdminAppController";
import {
    IS_APPLICATION_LOADING_PROPERTY,
    IS_APPLICATION_LOADING_PROPERTY_NAME
} from "./components/AdminApplicationState";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";

export let CURRENT_THEME: Theme = vetTheme;

export default class AdminApp extends React.Component<{}, AdminAppComponentState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            [IS_APPLICATION_LOADING_PROPERTY_NAME]: true,
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={CURRENT_THEME}>
                <AppHeader position={"static"}>
                    <TabComponent label={"Users list"}/>
                </AppHeader>
                <AppContent>
                    <UserListPage/>
                </AppContent>
                <LoadingMoire visible={this.state.isApplicationLoading}/>
                <Footer/>
            </MuiThemeProvider>
        )
    }

    componentDidMount(): void {
        const controller = AdminAppController.getInstance()
        controller.subscribe(IS_APPLICATION_LOADING_PROPERTY, this)
        controller.startApplication()
    }
}

type AdminAppComponentState = {
    [IS_APPLICATION_LOADING_PROPERTY_NAME]: boolean,
}