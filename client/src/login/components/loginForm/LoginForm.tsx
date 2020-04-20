import * as React from "react";
import {ButtonComponent} from "../../../core/components";
import {Message} from "../../../core/components/Message";
import ConnectedTextField from "../../../core/components/conntectedTextField/ConnectedTextField";
import LoginApplicationController from "../../controller/LoginApplicationController";
import {LoginStateProperty} from "../../state/LoginApplicationState";

var styles = require("./styles.css");

export default class LoginForm extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.IsSubmitAllowed]: false,
        }
    }

    render() {
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
            <div className={styles.buttonsArea}>
                <ButtonComponent
                    variant="contained"
                    color="primary"
                    disabled={!this.state[StateProperty.IsSubmitAllowed]}
                    onClick={() => this.props.controller.submitLoginForm()}
                >
                    <Message messageKey="login.title"/>
                </ButtonComponent>
            </div>
        </div>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(LoginStateProperty.IsAllowedToSubmit, this, StateProperty.IsSubmitAllowed)
    }
}

enum StateProperty {
    IsSubmitAllowed = "isSubmitAllowed",
}

type Properties = {
    controller: LoginApplicationController,
}

type State = {
    [StateProperty.IsSubmitAllowed]: false,
}
