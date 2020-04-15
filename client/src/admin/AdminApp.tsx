import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import {AppHeader} from "../core/components";
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
import {Tab} from "@material-ui/core";
import ErrorModal from "../core/components/errrorModal/ErrorModal";
import {GlobalStateProperty} from "./state/AdminApplicationState";
import MaskTransformer from "../core/utils/MaskTransformer";

export let CURRENT_THEME: Theme = vetTheme;

export default class AdminApp extends React.Component<Properties, State> {

    private controller: AdminAppController

    constructor(props: Properties) {
        super(props);
        this.state = {
            [StateProperty.IsLoading]: true,
        }
        ApplicationHolder.initialize(ApplicationType.Admin)
        //TODO: remove from here
        LocaleHolder.initialize(DEFAULT_LOCALE)
        this.controller = AdminAppController.instance
        const maskTransformer = new MaskTransformer("? (???) ???-??-??")
        console.log(maskTransformer.fromPureToMask("89535048752"))
        console.log(maskTransformer.fromPureToMask("8953504"))
        console.log(maskTransformer.fromMaskToPure("8 (953) 504-87-52"))
        console.log(maskTransformer.fromMaskToPure("8 (953) 504-87-__"))
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
                <ErrorModal controller={this.controller}/>
                <Footer/>
            </MuiThemeProvider>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(GlobalStateProperty.IsApplicationLoading, this, StateProperty.IsLoading)
        this.controller.startApplication()
    }
}

enum StateProperty {
    IsLoading = "isLoading"
}

type Properties = {}

type State = {
    [StateProperty.IsLoading]: boolean,
}