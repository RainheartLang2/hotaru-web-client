import * as React from "react";
import {Message} from "../Message";
import {TextField} from "@material-ui/core";
import CustomTooltip from "../customTooltip/CustomTooltip";
import {Autocomplete} from "@material-ui/lab";

export default abstract class CustomAutoCompleteField<ItemType,
    Props extends CustomAutoCompleteProps<ItemType> = CustomAutoCompleteProps<ItemType>,
    State extends CustomAutoCompleteState<ItemType> = CustomAutoCompleteState<ItemType>>
    extends React.Component<Props, State> {

    static defaultProps = {
        variant: "standard",
        disabled: false,
        size: 'small',
        fullWidth: true,
        onChange: () => {},
        onBlur: () => {},
        required: false,
    }

    private showRequiredError(): boolean {
        return this.props.required && this.state.changed && !this.state.selectedItem
    }

    protected abstract setValue(value: ItemType | null): void

    render() {
        // @ts-ignore
        // @ts-ignore
        return (
            <CustomTooltip
                arrow={true}
                title={<Message messageKey={"common.required.field.tooltip"} />}
                active={this.showRequiredError()}
            >
                <Autocomplete<ItemType>
                    options={this.state.options}
                    getOptionLabel={(option) => {
                        return this.props.itemToString(option)
                    }}
                    onChange={(event, value) => {
                        this.setValue(value)
                        this.props.onChange(value)
                    }}
                    fullWidth={this.props.fullWidth}
                    size={this.props.size}
                    value={this.state.selectedItem}
                    disabled={this.props.disabled}
                    renderInput={(params) =>
                        //@ts-ignore
                        <TextField
                            {...params}
                            label={this.props.label}
                            variant={this.props.variant}
                            disabled={this.props.disabled}
                            size={this.props.size}
                            fullWidth={this.props.fullWidth}
                            error={this.showRequiredError()}
                            onBlur={(event) => {
                                this.setState({
                                    changed: true,
                                })
                                this.props.onBlur(event)
                            }}
                        />}
                />
            </CustomTooltip>

        )
    }

}

export type CustomAutoCompleteProps<ItemType> = {
    itemToString: (item: ItemType) => string,
    label?: React.ReactNode,
    variant: "standard" | "filled" | "outlined",
    disabled?: boolean,
    size: 'small' | 'medium',
    fullWidth: boolean,
    onChange: (value: ItemType | null) => void,
    onBlur: (event: React.FocusEvent<{ name?: string | undefined; value: unknown; }>) => void,
    required: boolean,
}

export type CustomAutoCompleteState<ItemType> = {
    options: ItemType[],
    selectedItem: ItemType | null,
    changed: boolean,
}
