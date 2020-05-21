import * as React from "react";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import {ButtonComponent} from "../../../../../../core/components";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../../../state/EmployeeApplicationStore";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";

var styles = require("./styles.css");

export default class CredentialsSection extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            changePassword: false,
            showButton: false,
            fieldsObligatory: false,
        }
    }

    render() {
        const changePasswordFlag = this.state.changePassword
        const fieldsObligatory = this.state.fieldsObligatory
        return (
            <div className={styles.section}>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeLogin: "editedEmployeeLoginField"}}
                        label={(<Message messageKey={"field.login.label"}/>)}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeePassword: "editedEmployeePasswordField"}}
                        label={(<Message messageKey={"field.password.label"}/>)}
                        type={"password"}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeConfirmPassword: "editedEmployeeConfirmPasswordField"}}
                        label={(<Message messageKey={"field.password.repeat.label"}/>)}
                        type={"password"}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row + " " + styles.buttonsArea}>
                    {this.state.showButton && (
                        <ButtonComponent
                            variant="contained"
                            color={changePasswordFlag ? "secondary" : "primary"}
                            size="small"
                            onClick={() => this.props.controller.setState({isEditedEmployeePasswordChanged: !changePasswordFlag})}
                        >
                            <Message messageKey={changePasswordFlag
                                                    ? "common.button.cancel"
                                                    : "dialog.employee.button.changePassword.label"}/>
                        </ButtonComponent>
                    )}
                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            isEditedEmployeePasswordChanged: "changePassword",
            editedEmployeeChangePasswordButtonShow: "showButton",
            isChangePasswordObligatory: "fieldsObligatory",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController,
}

type State = {
    changePassword: boolean,
    showButton: boolean,
    fieldsObligatory: boolean,
}