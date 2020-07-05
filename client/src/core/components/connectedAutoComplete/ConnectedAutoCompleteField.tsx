import * as React from "react";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import ApplicationStore, {DefaultStateType} from "../../mvc/store/ApplicationStore";
import {CommonUtils} from "../../utils/CommonUtils";
import CustomAutoCompleteField, {CustomAutoCompleteProps} from "../customAutoComplete/CustomAutoCompleteField";

export default class ConnectedAutoCompleteField<
    ItemType,
    StateType extends DefaultStateType,
    SelectorsType,
    StoreType extends ApplicationStore<StateType, SelectorsType>,
    >
    extends CustomAutoCompleteField<ItemType, Properties<StateType, SelectorsType, StoreType, ItemType>> {

    static defaultProps = {
        variant: "standard",
        disabled: false,
        size: 'small',
        fullWidth: true,
        onChange: () => {},
        onBlur: () => {},
        required: false,
        controlled: true,
    }

    constructor(props: Properties<StateType, SelectorsType, StoreType, ItemType>) {
        super(props)
        this.state = {
            options: [],
            selectedItem: null,
            changed: false,
        }
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

    protected setValue(value: ItemType | null): void {
        this.props.controller.setState(CommonUtils.createLooseObject([[this.props.selectedItemProperty, value]]))
    }
}

export type Properties<StateType extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<StateType, DerivationType>, ItemType> =
    CustomAutoCompleteProps<ItemType> &
    {
    controller: ApplicationController<StateType, DerivationType, StoreType>,
    selectedItemProperty?: keyof StateType,
    itemsProperty: keyof (StateType & DerivationType),
}