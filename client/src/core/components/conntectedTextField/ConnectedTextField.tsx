import * as React from "react";
import {TextField} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import Tooltip from "@material-ui/core/Tooltip";
import {Field} from "../../mvc/store/Field";
import MaskTransformer from "../../utils/MaskTransformer";

export default class ConnectedTextField extends React.Component<Properties, State> {

    private maskTransformer: MaskTransformer = new MaskTransformer("")

    constructor(props: Properties) {
        super(props);
        if (props.mask) {
            this.maskTransformer = new MaskTransformer(props.mask)
        }
        this.state = {
            [StateProperty.FieldAlias]: {
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
                {this.state[StateProperty.FieldAlias].errors.map((errorText, index) => {
                    return (<div key={index}>{errorText}</div>)
                })}
            </>
        )
    }

    private hasErrors(): boolean {
        return this.state[StateProperty.FieldAlias].validationActive
            && this.state[StateProperty.FieldAlias].errors.length > 0
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const eventValue = event.target.value
        const settedValue = this.props.mask
            ? this.maskTransformer.fromMaskToPure(eventValue)
            : eventValue
        this.props.controller
            .setFieldValue(this.props.fieldPropertyName, settedValue)
        this.props.controller.toggleFieldValidation(this.props.fieldPropertyName, true)
    }

    private getValue(): string {
        const value = this.state[StateProperty.FieldAlias].value
        return this.props.mask
            ? this.maskTransformer.fromPureToMask(value)
            : value
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
                        size={this.props.size != null ? this.props.size : 'small'}
                        fullWidth={this.props.fullWidth != null ? this.props.fullWidth : true}
                        rows={this.props.rows}
                        type={this.props.type ? this.props.type : "text"}
                        variant={this.props.variant ? this.props.variant : "standard"}
                        disabled={this.props.disabled != null ? this.props.disabled : false}

                        value={this.getValue()}
                        error={this.hasErrors()}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.onChange(event)}
                    />
                </Tooltip>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this.props.fieldPropertyName, this, StateProperty.FieldAlias)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    FieldAlias = "fieldAlias"
}

type Properties = {
    controller: ApplicationController,
    fieldPropertyName: string,
    label?: React.ReactNode,
    disabled?: boolean,
    required?: boolean,
    size?: 'small' | 'medium',
    fullWidth?: boolean,
    mask?: string,
    rows?: number,
    defaultValue?: string,
    type?: "text" | "password" | "time",
    variant?: "standard" | "filled" | "outlined"
}

type State = {
    [StateProperty.FieldAlias]: Field<string>
}

