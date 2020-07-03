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
            value: props.defaultValue ? props.defaultValue as string : "",
            errorMessage: "",
        }
    }

    private validate(event: React.ChangeEvent<HTMLInputElement>): void {
        let errorValidator : FieldValidator | null = null
        this.props.validators.forEach(validator => {
            if (!validator.isValid(event.target.value)) {
                errorValidator = validator
            }
        })
        this.setState({
            valid: !errorValidator,
            value: (!!errorValidator && errorValidator!.isAbortingValidator()) ? this.state.value : event.target.value,
            errorMessage: !errorValidator ? "" : errorValidator!.getErrorMessage(),
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
                            this.props.onValidBlur()
                        }
                    }}
                    value = {this.state.value}
                />
            </CustomTooltip>
        )
    }
}

type Properties = TextFieldProps & {
    validators: FieldValidator[]
    onValidBlur: Function
}

type State = {
    valid: boolean
    showError: boolean
    value: string
    errorMessage: string
}