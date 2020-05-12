import {Checkbox, FormControlLabel, FormGroup, InputLabel} from "@material-ui/core";
import * as React from "react";
import ApplicationController from "../../mvc/ApplicationController";
import {ReactNode} from "react";

export default class ConnectedCheckbox extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.IsChecked]: false
        }
    }

    render() {
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state[StateProperty.IsChecked]}
                            onChange={(event) =>
                                this.props.controller.setPropertyValue(this.props.propertyName, event.target.checked)}
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

    componentDidMount(): void {
        this.props.controller.subscribe(this.props.propertyName, this, StateProperty.IsChecked)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    IsChecked = "isChecked",
}

type Properties = {
    controller: ApplicationController,
    propertyName: string,
    label: ReactNode,
}

type State = {
    [StateProperty.IsChecked]: boolean
}