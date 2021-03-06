import * as React from "react";
import {TextField, TextFieldProps} from "@material-ui/core";
import FieldValidator from "../../mvc/validators/FieldValidator";
import CustomTooltip from "../customTooltip/CustomTooltip";

export default class ValidatedTextField extends React.Component<Properties, State> {

    static defaultProps = {
        onValidBlur: () => {},
        variant: "outlined",
        size: "small",
    }

    constructor(props: Properties) {
        super(props)
        this.state = {
            valid: true,
            showError: false,
            value: props.defaultValue
                ? props.defaultValue as string
                : (props.value ? props.value as string : ""),
            errorMessage: "",
        }
    }

    private validate(event: React.ChangeEvent<HTMLInputElement>): void {
        let errorValidators : FieldValidator[] = []
        this.props.validators.forEach(validator => {
            if (!validator.isValid(event.target.value)) {
                errorValidators.push(validator)
            }
        })
        const abortingValidators = errorValidators.filter(validator => validator.isAbortingValidator())
        const isThereAbortingValidator = abortingValidators.length > 0
        const error = !isThereAbortingValidator && errorValidators.length > 0
        this.setState({
            valid: !error,
            value: (isThereAbortingValidator) ? this.state.value : event.target.value,
            errorMessage: !error ? "" : errorValidators[0].getErrorMessage(),
        })
    }

    private hasError(): boolean {
        return this.state.showError && (this.props.error || !this.state.valid)
    }

    render() {
        return (
            <CustomTooltip title={this.state.errorMessage}
                           active={this.hasError()}
            >
                <TextField
                    {...this.props}
                    error={this.hasError()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (this.props.onChange) {
                            this.props.onChange(event)
                        }
                        this.validate(event)
                    }}
                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                        if (this.props.onBlur) {
                            this.props.onBlur(event)
                        }
                        if (!this.state.showError) {
                            this.setState({
                                showError: true,
                            })
                        }
                        if (this.state.valid) {
                            this.props.onValidBlur(event)
                        }
                    }}
                    value = {this.state.value}
                />
            </CustomTooltip>
        )
    }

    componentWillReceiveProps(nextProps: Readonly<Properties>, nextContext: any): void {
        if (nextProps.value != null && nextProps.value != undefined) {
            this.setState({value: nextProps.value as string})
        }
    }
}

type Properties = TextFieldProps & {
    validators: FieldValidator[]
    onValidBlur: (event: React.FocusEvent<HTMLInputElement>) => void
}

type State = {
    valid: boolean
    showError: boolean
    value: string
    errorMessage: string
}