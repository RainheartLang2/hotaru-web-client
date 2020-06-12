import * as React from "react";
import {ReactNode} from "react";
import {Checkbox, FormControlLabel, FormGroup, InputLabel} from "@material-ui/core";

export default class ControlledCheckBox extends React.Component<Properties> {
    render() {
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.props.checked}
                            onChange={this.props.onChange}
                            color="primary"
                        />}
                    label={
                        this.props.label && (
                            <InputLabel>
                                {this.props.label}
                            </InputLabel>
                        )
                    }
                    labelPlacement="end"
                >
                </FormControlLabel>
            </FormGroup>
        )
    }
}

type Properties = {
    label: ReactNode,
    checked: boolean,
    onChange:(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}