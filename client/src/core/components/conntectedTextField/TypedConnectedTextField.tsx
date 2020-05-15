import * as React from "react";
import {TextField} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import {Field} from "../../mvc/store/Field";
import MaskTransformer from "../../utils/MaskTransformer";
import TypedApplicationController from "../../mvc/controllers/TypedApplicationController";
import TypedApplicationStore from "../../mvc/store/TypedApplicationStore";

export default class TypedConnectedTextField<StateType, DerivationType, StoreType extends TypedApplicationStore<StateType, DerivationType>>
    extends React.Component<Properties<StateType, DerivationType, StoreType>, State> {

    private maskTransformer: MaskTransformer = new MaskTransformer("")

    constructor(props: Properties<StateType, DerivationType, StoreType>) {
        super(props);
        if (props.mask) {
            this.maskTransformer = new MaskTransformer(props.mask)
        }
        this.state = {
            field: {
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
                {this.state.field.errors.map((errorText, index) => {
                    return (<div key={index}>{errorText}</div>)
                })}
            </>
        )
    }

    private hasErrors(): boolean {
        return this.state.field.validationActive
            && this.state.field.errors.length > 0
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const eventValue = event.target.value
        const settedValue = this.props.mask
            ? this.maskTransformer.fromMaskToPure(eventValue)
            : eventValue
        this.props.controller
            .setState({[this.props.originalPropertyKey]: settedValue} as unknown as Partial<StateType>)
        this.props.controller.toggleFieldValidation(this.props.fieldKey, true)
    }

    private getValue(): string {
        const value = this.state.field.value
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
        this.props.controller.subscribe(this, this.props.fieldKey, "field")
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<StateType, DerivationType, StoreType extends TypedApplicationStore<StateType, DerivationType>> = {
    controller: TypedApplicationController<StateType, DerivationType, StoreType>,
    fieldKey: keyof DerivationType,
    originalPropertyKey: keyof StateType,
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
    field: Field
}

