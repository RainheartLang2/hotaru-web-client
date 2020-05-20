import * as React from "react";
import {Message} from "../../../core/components/Message";
import LoginApplicationController from "../../controller/LoginApplicationController";
import TypedConnectedTextField from "../../../core/components/conntectedTextField/TypedConnectedTextField";
import LoginApplicationStore, {LoginDerivationState, LoginState} from "../../state/LoginApplicationStore";
import TypedCustomButton from "../../../core/components/customButton/TypedCustomButton";

var styles = require("./styles.css");

export default class LoginForm extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            hasError: "",
            isSubmitAllowed: false,
        }
    }

    render() {
        const loginFormError = this.state.hasError
        return (<div className={styles.loginForm}>
            <div className={styles.loginField}>
                <TypedConnectedTextField<LoginState, LoginDerivationState, LoginApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{login: "loginField"}}
                    variant="outlined"
                    label={(<Message messageKey={"field.login.label"}/>)}
                    size="small"
                />
            </div>

            <div className={styles.passwordField}>
                <TypedConnectedTextField<LoginState, LoginDerivationState, LoginApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{password: "passwordField"}}
                    variant="outlined"
                    label={(<Message messageKey={"field.password.label"}/>)}
                    size="small"
                    type="password"
                />

            </div>
            <div className={styles.errorsArea}>
                {loginFormError && (<Message messageKey={"error.message." + loginFormError}/>)}
            </div>
            <div className={styles.buttonsArea}>
                <TypedCustomButton<LoginState, LoginDerivationState, LoginApplicationStore>
                    controller={this.props.controller}
                    variant="contained"
                    color="primary"
                    disabled={!this.state.isSubmitAllowed}
                    onClick={() => this.props.controller.submitLoginForm()}
                    loadingProperty={"isLoginButtonLoading"}
                >
                    <Message messageKey="login.title"/>
                </TypedCustomButton>
            </div>
        </div>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            hasError: "hasError",
            isAllowedToSubmit: "isSubmitAllowed",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: LoginApplicationController,
}

type State = {
    hasError: "",
    isSubmitAllowed: false,
}
