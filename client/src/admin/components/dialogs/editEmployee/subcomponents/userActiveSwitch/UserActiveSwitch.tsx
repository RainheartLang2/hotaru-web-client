import * as React from "react";
import {FormControlLabel, Switch} from "@material-ui/core";
import {Message} from "../../../../../../core/components/Message";

var styles = require("./styles.css");

export default class UserActiveSwitch extends React.Component<Properties> {
    render() {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={this.props.active}
                        color="primary"
                        onChange={this.props.onChange}
                    />}
                label={
                    <div className={styles.activeSwitchLabel}>
                        <Message messageKey={this.props.active
                            ? "dialog.employee.control.active.label"
                            : "dialog.employee.control.notActive.label"}
                        />
                    </div>
                }
                labelPlacement="start"
            />
        )
    }
}

type Properties = {
    active: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void,
}