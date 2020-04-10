import * as React from "react";
import {TextField} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import {FieldType} from "../../mvc/ApplicationStore";
import Tooltip from "@material-ui/core/Tooltip";

const ALIAS = "fieldData"

export default class ConnectedTextField extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);
        this.state = {
            fieldData: {
                value: this.props.defaultValue || "",
                errors: [],
                validators: [],
                validationActive: false,
            }
        }
    }

    private getTooltipText(): React.ReactNode {
        return (
            <>
                {this.state[ALIAS].errors.map((errorText, index) => {
                    return (<div key={index}>{errorText}</div>)
                })}
            </>
        )
    }

    private hasErrors(): boolean {
        return this.state[ALIAS].validationActive && this.state[ALIAS].errors.length > 0
    }

    render() {
        return (
            <>
                <Tooltip
                    arrow={true}
                    title={this.getTooltipText()}
                    PopperProps={{
                        style: {
                            visibility: this.hasErrors() ? "visible" : "hidden",
                        }
                    }}
                >
                    <TextField
                        label={this.props.label}
                        size={this.props.size}
                        fullWidth={this.props.fullWidth}
                        defaultValue={this.props.defaultValue}

                        value={this.state[ALIAS].value}
                        error={this.hasErrors()}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            this.props.controller
                                .setFieldValue(this.props.fieldPropertyName, event.target.value)
                            this.props.controller.toggleFieldValidation(this.props.fieldPropertyName, true)
                        }}
                    />
                </Tooltip>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this.props.fieldPropertyName, this, ALIAS)
    }
}

type Properties = {
    controller: ApplicationController,
    fieldPropertyName: string,
    label?: React.ReactNode,
    required?: boolean,
    size?: 'small' | 'medium',
    fullWidth?: boolean,
    defaultValue?: string,
}

type State = {
    [ALIAS]: FieldType<string>
}

