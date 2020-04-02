import * as React from "react";
import {CommonButton, InputField} from "../core/components";

var styles = require("./LoginForm.css");

export default class LoginForm extends React.Component {
    render() {
        return (<div className={styles.loginForm}>
            <InputField className={styles.loginField}
                        variant="outlined"
                        label={"Логин"}
                        size={"small"}
            />
            <InputField className={styles.passwordField}
                        variant="outlined"
                        label={"Пароль"}
                        size={"small"}
                        type={"password"}
            />
            <div className={styles.buttonsArea}>
                <CommonButton variant="contained" color="primary">
                    Войти
                </CommonButton>
            </div>
        </div>)
    }
}