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

export default abstract class MinorListBase<ItemType, Props extends MinorListProperties<ItemType>>
    extends React.Component<Props, MinorListState<ItemType>> {

    static defaultProps = {
        addButton: true,
        addTooltipLabel: "",
        onAddButtonClick: () => {},
    }

    constructor(props: Props) {
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
                {this.props.addButton &&
                <div>
                    <CustomContentButton
                        onClick={() => this.props.onAddButtonClick()}
                        tooltipContent={this.props.addTooltipLabel}
                    >
                        <AddIcon/>
                    </CustomContentButton>
                </div>
                }

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
}

export type MinorListProperties<ItemType> = {
    label: ReactNode
    renderItem: (item: ItemType) => ReactNode
    addButton: boolean,
    onAddButtonClick: Function,
    addTooltipLabel: NonNullable<ReactNode>
}

type MinorListState<ItemType> = {
    items: ItemType[]
}