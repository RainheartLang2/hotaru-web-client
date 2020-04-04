import * as React from "react";
import LoginForm from "./LoginForm";
import {vetTheme} from "../common/themes";
import {MuiThemeProvider} from "../../node_modules/@material-ui/core/styles/index";

export default class LoginApp extends React.Component {

    render() {
        return (<MuiThemeProvider theme={vetTheme}>
            <LoginForm/>
        </MuiThemeProvider>)
    }
}