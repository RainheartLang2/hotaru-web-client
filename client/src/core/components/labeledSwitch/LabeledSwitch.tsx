import * as React from "react";
import {FormControlLabel, Switch} from "@material-ui/core";
import {Message} from "../Message";

var styles = require("./styles.css");

export default class LabeledSwitch extends React.Component<Properties> {
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
                            ? this.props.activeLabelKey
                            : this.props.notActiveLabelKey}
                        />
                    </div>
                }
                labelPlacement="start"
            >
            </FormControlLabel>
        )
    }
}

type Properties = {
    active: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void,
    activeLabelKey: string,
    notActiveLabelKey: string,
}