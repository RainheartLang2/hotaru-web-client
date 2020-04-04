import * as React from "react";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider, Theme} from "../../node_modules/@material-ui/core/styles/index";
import {AppBarComponent, PaperComponent, TabComponent} from "../core/components";
import Footer from "../core/components/footer/Footer";
import AppContent from "../core/components/appContent/AppContent";
import UserListPage from "./components/userlist/UserListPage";

export let CURRENT_THEME: Theme = vetTheme;

export default class AdminApp extends React.Component {
    render() {
        return (<MuiThemeProvider theme={CURRENT_THEME}>
            <AppBarComponent position={"static"}>
                <TabComponent label={"Users list"}/>
            </AppBarComponent>
            <AppContent>
                <UserListPage/>
            </AppContent>
            <Footer/>
        </MuiThemeProvider>)
    }
}