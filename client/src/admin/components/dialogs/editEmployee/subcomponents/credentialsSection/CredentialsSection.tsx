import * as React from "react";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../../controller/AdminAppController";
import {GlobalStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import {ButtonComponent} from "../../../../../../core/components";

var styles = require("./styles.css");

export default class CredentialsSection extends React.Component<Properties> {
    render() {
        return (
            <div className={styles.section}>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeeLogin}
                        label={(<Message messageKey={"field.login.label"}/>)}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeePassword}
                        label={(<Message messageKey={"field.password.label"}/>)}
                        type={"password"}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={GlobalStateProperty.EditedEmployeeConfirmPassword}
                        label={(<Message messageKey={"field.password.repeat.label"}/>)}
                        type={"password"}
                    />
                </div>
                <div className={styles.row}>
                    <ButtonComponent>

                    </ButtonComponent>
                </div>
            </div>
        )
    }
}

type Properties = {
    controller: AdminAppController,
}