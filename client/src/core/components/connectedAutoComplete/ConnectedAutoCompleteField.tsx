import * as React from "react";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationStore from "../../mvc/store/ApplicationStore";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from "@material-ui/core";
import {CommonUtils} from "../../utils/CommonUtils";
import CustomTooltip from "../customTooltip/CustomTooltip";
import {Message} from "../Message";

export default class ConnectedAutoCompleteField<
    ItemType,
    StateType extends DefaultStateType,
    SelectorsType,
    StoreType extends ApplicationStore<StateType, SelectorsType>,
    >
    extends React.Component<Properties<StateType, SelectorsType, StoreType, ItemType>, State<ItemType>> {

    static defaultProps = {
        variant: "standard",
        disabled: false,
        size: 'small',
        fullWidth: true,
        onChange: () => {},
        required: false,
    }

    constructor(props: Properties<StateType, SelectorsType, StoreType, ItemType>) {
        super(props)
        this.state = {
            options: [],
            selectedItem: null,
            changed: false,
        }
    }

    private showRequiredError(): boolean {
        return this.props.required && this.state.changed && !this.state.selectedItem
    }

    render() {
        return (
            <CustomTooltip  arrow={true} title={<Message messageKey={"common.required.field.tooltip"} />} active={this.showRequiredError()}>
                <Autocomplete<ItemType>
                    options={this.state.options}
                    getOptionLabel={(option) => this.props.itemToString(option)}
                    onChange={(event, value) => {
                        this.props.controller.setState(CommonUtils.createLooseObject([[this.props.selectedItemProperty, value]]))
                        this.props.onChange(value)
                    }}
                    fullWidth={this.props.fullWidth}
                    size={this.props.size}
                    value={this.state.selectedItem}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label={this.props.label}
                            variant={this.props.variant}
                            disabled={this.props.disabled}
                            size={this.props.size}
                            fullWidth={this.props.fullWidth}
                            error={this.showRequiredError()}
                            onBlur={() => {
                                this.setState({
                                    changed: true,
                                })
                            }}
                        />}
                />
            </CustomTooltip>

        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([
            [this.props.itemsProperty, "options"],
            [this.props.selectedItemProperty, "selectedItem"]
        ]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

export type Properties<StateType extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<StateType, DerivationType>, ItemType> = {
    controller: ApplicationController<StateType, DerivationType, StoreType>,
    itemToString: (item: ItemType) => string,
    label?: React.ReactNode,
    variant: "standard" | "filled" | "outlined",
    disabled?: boolean,
    size: 'small' | 'medium',
    fullWidth: boolean,
    selectedItemProperty: keyof StateType,
    itemsProperty: keyof (StateType & DerivationType),
    onChange: (value: ItemType | null) => void,
    required: boolean,
}

export type State<Type> = {
    options: Type[],
    selectedItem: Type | null,
    changed: boolean,
}