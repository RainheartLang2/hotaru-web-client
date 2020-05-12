import * as React from "react";
import {ButtonComponent} from "../../../core/components";
import {Message} from "../../../core/components/Message";
import ConnectedTextField from "../../../core/components/conntectedTextField/ConnectedTextField";
import LoginApplicationController from "../../controller/LoginApplicationController";
import {LoginStateProperty} from "../../state/LoginApplicationState";
import CustomButton from "../../../core/components/customButton/CustomButton";

var styles = require("./styles.css");

export default class LoginForm extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.HasError]: "",
            [StateProperty.IsSubmitAllowed]: false,
        }
    }

    render() {
        const loginFormError = this.state[StateProperty.HasError]
        return (<div className={styles.loginForm}>
            <div className={styles.loginField}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={LoginStateProperty.Login}
                    variant="outlined"
                    label={(<Message messageKey={"field.login.label"}/>)}
                    size="small"
                />
            </div>

            <div className={styles.passwordField}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={LoginStateProperty.Password}
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
                <CustomButton
                    controller={this.props.controller}
                    variant="contained"
                    color="primary"
                    disabled={!this.state[StateProperty.IsSubmitAllowed]}
                    onClick={() => this.props.controller.submitLoginForm()}
                    loadingProperty={LoginStateProperty.IsLoginButtonLoading}
                >
                    <Message messageKey="login.title"/>
                </CustomButton>
            </div>
        </div>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(LoginStateProperty.HasError, this, StateProperty.HasError)
        this.props.controller.subscribe(LoginStateProperty.IsAllowedToSubmit, this, StateProperty.IsSubmitAllowed)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    HasError = "hasError",
    IsSubmitAllowed = "isSubmitAllowed",
}

type Properties = {
    controller: LoginApplicationController,
}

type State = {
    [StateProperty.HasError]: "",
    [StateProperty.IsSubmitAllowed]: false,
}
