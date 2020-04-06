import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import {AppHeader, TabComponent} from "../core/components";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import UserListPage from "./components/userlist/UserListPage";
import AdminAppController from "./controller/AdminAppController";
import {IS_APPLICATION_LOADING_PROPERTY} from "./state/AdminApplicationState";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import AdminDialogsContainer from "./containers/AdminDialogsContainer";

export let CURRENT_THEME: Theme = vetTheme;
const IS_LOADING = "isLoading"

export default class AdminApp extends React.Component<{}, AdminAppComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            [IS_LOADING]: true,
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={CURRENT_THEME}>
                <AppHeader position={"static"}>
                    <TabComponent label={"Users list"}/>
                </AppHeader>
                <AppContent visible={!this.state.isLoading}>
                    <UserListPage/>
                </AppContent>
                <AdminDialogsContainer/>
                <LoadingMoire visible={this.state.isLoading}/>
                <Footer/>
            </MuiThemeProvider>
        )
    }

    componentDidMount(): void {
        const controller = AdminAppController.getInstance()
        controller.subscribe(IS_APPLICATION_LOADING_PROPERTY, this, IS_LOADING)
        controller.startApplication()
    }
}

type AdminAppComponentState = {
    [IS_LOADING]: boolean,
}