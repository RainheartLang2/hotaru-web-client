import {DefaultStateType} from "../../mvc/store/TypedApplicationStore";
import TypedApplicationStore from "../../mvc/store/TypedApplicationStore";
import * as React from "react";
import {ReactNode} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import {CommonUtils} from "../../utils/CommonUtils";

export default class TypedConnectedSelect<ItemType,
                                          StateType extends DefaultStateType,
                                          SelectorsType,
                                          StoreType extends TypedApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<ItemType, StateType, SelectorsType>, State<ItemType>> {

    static defaultProps = {
        variant: "outlined",
    }

    constructor(props: Properties<ItemType, StateType, SelectorsType>) {
        super(props)
        this.state = {
            itemsMap: new Map(),
            selectedItem: null,
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
            this.props.controller.setState(CommonUtils.createLooseObject([[this.props.selectedItemProperty, itemsMap.get(+(event.target.value as string))]]))
        }}
        value={getKey(this.state.selectedItem)}
        fullWidth={true}
        variant={this.props.variant}
            >
            {options}
            </Select>
            </FormControl>
    )
    }

    componentDidMount() {
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([
            [this.props.mapProperty, "itemsMap"],
            [this.props.selectedItemProperty, "selectedItem"],
        ]))
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
    selectedItemProperty: keyof StateType,
    itemToString: (item: ItemType) => string,
    getKey: (item: ItemType | null) => number,
}

type State<ItemType> = {
    itemsMap: Map<number, ItemType>,
    selectedItem: ItemType | null,
}