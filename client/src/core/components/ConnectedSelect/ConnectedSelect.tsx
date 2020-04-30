import * as React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import {ReactNode} from "react";

export default class ConnectedSelect<ItemType> extends React.Component<Properties<ItemType>, State<ItemType>> {
    constructor(props: Properties<ItemType>) {
        super(props)
        this.state = {
            [StateProperty.ItemsMap]: new Map(),
            [StateProperty.SelectedItem]: null,
        }
    }

    render() {
        const options: ReactNode[] = []
        const getKey = this.props.getKey
        const itemsMap = this.state[StateProperty.ItemsMap]
        itemsMap.forEach((item, key) => {
            options.push((
                <MenuItem value={key}>
                    {this.props.itemToString(item)}
                </MenuItem>
            ))
        })
        return (
            <FormControl>
                <InputLabel>
                    {this.props.label}
                </InputLabel>
                <Select
                    onChange={event => {
                        this.props.controller.setPropertyValue(this.props.selectedItemProperty, itemsMap.get(+(event.target.value as string)))
                    }}
                    value={getKey(this.state[StateProperty.SelectedItem])}
                    fullWidth={true}
                >
                    {options}
                </Select>
            </FormControl>
        )
    }

    componentDidMount() {
        this.props.controller.subscribe(this.props.mapProperty, this, StateProperty.ItemsMap)
        this.props.controller.subscribe(this.props.selectedItemProperty, this, StateProperty.SelectedItem)
    }
}

enum StateProperty {
    ItemsMap = "itemsMap",
    SelectedItem = "selectedItem",
}

type Properties<ItemType> = {
    controller: ApplicationController
    label: ReactNode,
    mapProperty: string,
    selectedItemProperty: string,
    itemToString: (item: ItemType) => string,
    getKey: (item: ItemType | null) => number,
}

type State<ItemType> = {
    [StateProperty.ItemsMap]: Map<number, ItemType>,
    [StateProperty.SelectedItem]: ItemType | null,
}