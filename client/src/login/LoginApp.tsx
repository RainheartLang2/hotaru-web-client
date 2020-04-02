import * as React from "react";
import LoginForm from "./LoginForm";
import {mainTheme} from "../common/Theme";
import {MuiThemeProvider} from "../../node_modules/@material-ui/core/styles/index";

export default class LoginApp extends React.Component {

    render() {
        return (<MuiThemeProvider theme={mainTheme}>
            <LoginForm/>
        </MuiThemeProvider>)
    }
}