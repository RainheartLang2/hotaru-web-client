import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import {AppHeader} from "../core/components";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import UserListPage from "./components/userlist/UserListPage";
import AdminAppController from "./controller/AdminAppController";
import {IS_APPLICATION_LOADING_PROPERTY} from "./state/AdminApplicationState";
import LoadingMoire from "../core/components/loadingMoire/LoadingMoire";
import AdminDialogsContainer from "./containers/AdminDialogsContainer";
import {ApplicationType} from "../core/enum/ApplicationType";
import ApplicationHolder from "../core/utils/ApplicationHolder";
import LocaleHolder from "../core/utils/LocaleHolder";
import {DEFAULT_LOCALE} from "../core/enum/LocaleType";
import {Tab} from "@material-ui/core";
import ErrorModal from "../core/components/errrorModal/ErrorModal";

export let CURRENT_THEME: Theme = vetTheme;
const IS_LOADING = "isLoading"

export default class AdminApp extends React.Component<{}, AdminAppComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            [IS_LOADING]: true,
        }
        ApplicationHolder.initialize(ApplicationType.ADMIN)
        console.log(1)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
    }

    render() {
        return (
            <MuiThemeProvider theme={CURRENT_THEME}>
                <AppHeader position={"static"}>
                    <Tab label={"Users list"}/>
                </AppHeader>
                <AppContent visible={!this.state.isLoading}>
                    <UserListPage/>
                </AppContent>
                <AdminDialogsContainer/>
                <LoadingMoire visible={this.state.isLoading}/>
                <ErrorModal controller={AdminAppController.getInstance()}/>
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