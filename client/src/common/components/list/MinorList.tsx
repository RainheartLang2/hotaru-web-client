import * as React from "react";
import {Message} from "../../../core/components/Message";
import {List, ListItem, ListItemText} from "@material-ui/core";
import AddIcon from '@material-ui/icons/AddSharp';
import {ReactNode} from "react";
import ApplicationController from "../../../core/mvc/controllers/ApplicationController";
import ApplicationStore, {DefaultStateType} from "../../../core/mvc/store/ApplicationStore";
import CustomContentButton from "../../../core/components/iconButton/CustomContentButton";
import {CommonUtils} from "../../../core/utils/CommonUtils";
import createLooseObject = CommonUtils.createLooseObject;

var styles = require("./styles.css")

export default class MinorList<ItemType,
    StateType extends DefaultStateType,
    SelectorsType, StoreType extends ApplicationStore<StateType, SelectorsType>>

    extends React.Component<Properties<ItemType, StateType, SelectorsType, StoreType>, State<ItemType>> {

    constructor(props: Properties<ItemType, StateType, SelectorsType, StoreType>) {
        super(props)
        this.state = {
            items: [],
        }
    }

    render() {
        return (<div className={styles.list}>
            <div className={styles.listHeader}>
                <div className={styles.listTitle}>
                    {this.props.label}
                </div>
                <div>
                    <CustomContentButton
                        onClick={() => this.props.onAddButtonClick()}
                        tooltipContent={this.props.addTooltipLabel}
                    >
                        <AddIcon/>
                    </CustomContentButton>
                </div>
            </div>
            <div className={styles.petsListContent}>
                <List>
                    {this.state.items.map(item => {
                        return (
                            <ListItem className={styles.petItem}>
                                {this.props.renderItem(item)}
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </div>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, createLooseObject([[this.props.itemsListProperty, "items"]]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<ItemType,
    StateType extends DefaultStateType,
    SelectorsType, StoreType extends ApplicationStore<StateType, SelectorsType>> = {

    controller: ApplicationController<StateType, SelectorsType, StoreType>
    itemsListProperty: keyof (StateType & SelectorsType)
    label: ReactNode
    renderItem: (item: ItemType) => ReactNode
    onAddButtonClick: Function,
    addTooltipLabel: NonNullable<ReactNode>
}

type State<ItemType> = {
    items: ItemType[]
}