import * as React from "react";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationStore from "../../mvc/store/ApplicationStore";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from "@material-ui/core";
import {CommonUtils} from "../../utils/CommonUtils";

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
    }

    constructor(props: Properties<StateType, SelectorsType, StoreType, ItemType>) {
        super(props)
        this.state = {
            options: [],
        }
    }

    render() {
        return (
            <Autocomplete<ItemType>
                options={this.state.options}
                getOptionLabel={(option) => this.props.itemToString(option)}
                onChange={(event, value) => {
                    this.props.controller.setState(CommonUtils.createLooseObject([[this.props.selectedItemProperty, value]]))
                }}
                fullWidth={this.props.fullWidth}
                size={this.props.size}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label={this.props.label}
                        variant={this.props.variant}
                        disabled={this.props.disabled}
                        size={this.props.size}
                        fullWidth={this.props.fullWidth}
                    />}
            />
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([
            [this.props.itemsProperty, "options"],
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
}

export type State<Type> = {
    options: Type[],
}