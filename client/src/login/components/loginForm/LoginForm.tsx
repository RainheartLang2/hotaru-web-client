import * as React from "react";
import {ButtonComponent} from "../../../core/components";
import {Message} from "../../../core/components/Message";
import ConnectedTextField from "../../../core/components/conntectedTextField/ConnectedTextField";
import LoginApplicationController from "../../controller/LoginApplicationController";
import CustomButton from "../../../core/components/customButton/CustomButton";
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
                    fieldKey={"loginField"}
                    originalPropertyKey={"login"}
                    variant="outlined"
                    label={(<Message messageKey={"field.login.label"}/>)}
                    size="small"
                />
            </div>

            <div className={styles.passwordField}>
                <TypedConnectedTextField<LoginState, LoginDerivationState, LoginApplicationStore>
                    controller={this.props.controller}
                    fieldKey={"passwordField"}
                    originalPropertyKey={"password"}
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
        this.props.controller.subscribe(this, "hasError", "hasError")
        this.props.controller.subscribe(this, "isAllowedToSubmit", "isSubmitAllowed")
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
