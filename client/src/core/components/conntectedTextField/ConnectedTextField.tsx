import * as React from "react";
import {TextField} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import {Field} from "../../mvc/store/Field";
import MaskTransformer from "../../utils/MaskTransformer";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import ApplicationStore, {DefaultStateType} from "../../mvc/store/ApplicationStore";
import {CommonUtils} from "../../utils/CommonUtils";

export default class ConnectedTextField<StateType extends DefaultStateType,
                                            SelectorsType,
                                            StoreType extends ApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<StateType, SelectorsType, StoreType>, State> {

    private maskTransformer: MaskTransformer = new MaskTransformer("")

    constructor(props: Properties<StateType, SelectorsType, StoreType>) {
        super(props)
        this.checkFieldKey()
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

    private checkFieldKey(): void {
        //TODO: implement
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

    private getKeys(): [keyof StateType, keyof SelectorsType] {
        for (let originalFieldKey in this.props.fieldKey) {
            const originalKey = originalFieldKey as keyof StateType
            const selectorFieldKey = this.props.fieldKey[originalFieldKey] as keyof SelectorsType
            return [originalKey, selectorFieldKey]
        }
        throw new Error("No field key property")
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
        const keys = this.getKeys()
        this.props.controller
            .setState({[keys[0]]: settedValue} as unknown as Partial<StateType>)
        this.props.controller.toggleFieldValidation(keys[1], true)
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
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([[this.getKeys()[1], "field"]]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type FieldCorrelationRecord<StateType, SelectorsType> = {
    [P in keyof StateType]: keyof SelectorsType
}

export type FieldInfo<StateType, SelectorsType> = Partial<FieldCorrelationRecord<StateType, SelectorsType>>

type Properties<StateType extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<StateType, DerivationType>> = {
    controller: ApplicationController<StateType, DerivationType, StoreType>,
    fieldKey: FieldInfo<StateType, DerivationType>,
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

