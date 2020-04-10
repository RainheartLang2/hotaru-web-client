import * as React from "react";
import {ButtonComponent} from "../core/components";
import {TextField} from "@material-ui/core";

var styles = require("./LoginForm.css");

export default class LoginForm extends React.Component {
    render() {
        return (<div className={styles.loginForm}>
            <TextField className={styles.loginField}
                        variant="outlined"
                        label={"Логин"}
                        size={"small"}
            />
            <TextField className={styles.passwordField}
                        variant="outlined"
                        label={"Пароль"}
                        size={"small"}
                        type={"password"}
            />
            <div className={styles.buttonsArea}>
                <ButtonComponent variant="contained" color="primary">
                    Войти
                </ButtonComponent>
            </div>
        </div>)
    }
}