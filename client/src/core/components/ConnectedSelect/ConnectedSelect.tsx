import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationStore from "../../mvc/store/ApplicationStore";
import * as React from "react";
import {ReactNode} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import {CommonUtils} from "../../utils/CommonUtils";

export default class ConnectedSelect<ItemType,
                                          StateType extends DefaultStateType,
                                          SelectorsType,
                                          StoreType extends ApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<ItemType, StateType, SelectorsType>, State<ItemType>> {

    static defaultProps = {
        variant: "outlined",
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {},
        controlled: true,
        defaultValue: null,
    }

    constructor(props: Properties<ItemType, StateType, SelectorsType>) {
        super(props)
        if (props.controlled && !props.selectedItemProperty) {
            throw new Error("selectedItemProperty should be defined for controlled select")
        }
        if (!props.controller && props.selectedItemProperty) {
            throw new Error("selected shoud not be defined for uncontrolled select")
        }
        this.state = {
            itemsMap: new Map(),
            selectedItem: this.props.defaultValue,
        }
    }

    render() {
        const options: ReactNode[] = []
        const getKey = this.props.getKey
        const itemsMap = this.state.itemsMap
        itemsMap.forEach((item, key) => {
            options.push((
                <MenuItem value={key}>
                    {this.props.itemToString(item)}
                    </MenuItem>
            ))
        })
        return (
            <FormControl>
                {this.props.label && (
                        <InputLabel>
                            {this.props.label}
                        </InputLabel>
                    )}
            <Select
                onChange={event => {
                    const selectedItem = itemsMap.get(+(event.target.value as string))
                    this.props.controller.setState(CommonUtils.createLooseObject([[this.props.selectedItemProperty, selectedItem]]))
                    this.props.onChange(event)
                    if (!this.props.controlled) {
                        this.setState({
                            selectedItem: selectedItem ? selectedItem : null,
                        })
                    }
                }}
                value={getKey(this.state.selectedItem)}
                fullWidth={true}
                variant={this.props.variant}
                onBlur={this.props.onBlur}
                onFocus={this.props.onFocus}
            >
                {options}
            </Select>
            </FormControl>
    )
    }

    componentDidMount() {
        const properties: [any, any][] = [[this.props.mapProperty, "itemsMap"]]
        if (this.props.controlled) {
            properties.push([this.props.selectedItemProperty, "selectedItem"])
        }
        this.props.controller.subscribe(this, CommonUtils.createLooseObject(properties))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<ItemType, StateType, SelectorsType> = {
    controller: EmployeeAppController
    label?: ReactNode,
    variant?: "standard" | "outlined"
    mapProperty: keyof (StateType & SelectorsType),
    selectedItemProperty?: keyof StateType,
    itemToString: (item: ItemType) => string,
    getKey: (item: ItemType | null) => number,
    onChange: (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void,
    onBlur: (event: React.FocusEvent<{ name?: string | undefined; value: unknown; }>) => void,
    onFocus: (event: React.FocusEvent<{ name?: string | undefined; value: unknown; }>) => void,
    controlled: boolean,
    defaultValue: ItemType
}

type State<ItemType> = {
    itemsMap: Map<number, ItemType>,
    selectedItem: ItemType | null,
}