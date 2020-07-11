import * as React from "react";
import {Checkbox, FormControlLabel, FormGroup, InputLabel} from "@material-ui/core";
import {ReactNode} from "react";

var styles = require("./styles.css")

export default abstract class CustomCheckBoxBase<Props extends CustomCheckBoxProps>
    extends React.Component<Props, CustomCheckBoxState> {
    render() {
        return (
            <div className={styles.form} onClick={() => this.onChange(!this.isChecked())}>
                <div className={styles.checkBox}>
                    <Checkbox
                        checked={this.isChecked()}
                        value={this.isChecked()}
                        color="primary"
                    />
                </div>
                <div className={styles.label}>
                    {this.props.label}
                </div>
            </div>
        )
    }

    protected abstract isChecked(): boolean

    protected abstract onChange(value: boolean): void
}

export type CustomCheckBoxProps = {
    label: ReactNode
}

export type CustomCheckBoxState = {
}