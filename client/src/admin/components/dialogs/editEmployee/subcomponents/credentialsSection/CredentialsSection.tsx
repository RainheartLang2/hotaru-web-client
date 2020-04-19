import * as React from "react";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../../controller/AdminAppController";
import {GlobalStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import {ButtonComponent} from "../../../../../../core/components";

var styles = require("./styles.css");

export default class CredentialsSection extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.ChangePassword]: false,
            [StateProperty.ShowButton]: false,
            [StateProperty.FieldsObligatory]: false,
        }
    }

    render() {
        const changePasswordFlag = this.state[StateProperty.ChangePassword]
        const fieldsObligatory = this.state[StateProperty.FieldsObligatory]
        return (
            <div className={styles.section}>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeeLogin}
                        label={(<Message messageKey={"field.login.label"}/>)}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeePassword}
                        label={(<Message messageKey={"field.password.label"}/>)}
                        type={"password"}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeeConfirmPassword}
                        label={(<Message messageKey={"field.password.repeat.label"}/>)}
                        type={"password"}
                        disabled={!fieldsObligatory}
                    />
                </div>
                <div className={styles.row + " " + styles.buttonsArea}>
                    {this.state[StateProperty.ShowButton] && (
                        <ButtonComponent
                            variant="contained"
                            color={changePasswordFlag ? "secondary" : "primary"}
                            size="small"
                            onClick={() => {
                                this.props.controller.employeeActions.setChangePassword(!changePasswordFlag)
                            }}
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
        this.props.controller.subscribe(GlobalStateProperty.IsEmployeeChangePassword, this, StateProperty.ChangePassword)
        this.props.controller.subscribe(GlobalStateProperty.IsChangePasswordButtonShow, this, StateProperty.ShowButton)
        this.props.controller.subscribe(GlobalStateProperty.IsChangePasswordObligatory, this, StateProperty.FieldsObligatory)
    }
}

enum StateProperty {
    ChangePassword = "changePassword",
    ShowButton = "showButton",
    FieldsObligatory = "fieldsObligatory",
}

type Properties = {
    controller: AdminAppController,
}

type State = {
    [StateProperty.ChangePassword]: boolean,
    [StateProperty.ShowButton]: boolean,
    [StateProperty.FieldsObligatory]: boolean,
}