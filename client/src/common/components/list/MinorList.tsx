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
import DisablingMoire from "../../../core/components/disablingMoire/DisablingMoire";

var styles = require("./styles.css")

export default abstract class MinorListBase<ItemType, Props extends MinorListProperties<ItemType>>
    extends React.Component<Props, MinorListState<ItemType>> {

    static defaultProps = {
        addButton: true,
        addTooltipLabel: "",
        onAddButtonClick: () => {},
        disabled: false,
        additionalHeaderComponent: null,
        wrapAddButton: (addButton: ReactNode) => addButton
    }

    render() {
        return (<div className={styles.list}>
            <DisablingMoire active={this.props.disabled}/>
            <div className={styles.listHeader}>
                <div className={styles.listTitleRow}>
                    <div className={styles.listTitle}>
                        {this.props.label}
                    </div>
                    {this.props.addButton &&
                     this.props.wrapAddButton(
                         <div>
                             <CustomContentButton
                                 onClick={() => this.props.onAddButtonClick()}
                                 tooltipContent={this.props.addTooltipLabel}
                             >
                                 <AddIcon/>
                             </CustomContentButton>
                         </div>
                     )
                    }
                </div>
                {this.props.additionalHeaderComponent
                &&
                <div>
                    {this.props.additionalHeaderComponent}
                </div>
                }
            </div>
            <div className={styles.listContent}>
                <List>
                    {this.state.items.map(item => {
                        return (
                            <ListItem className={styles.item}>
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
    wrapAddButton: (addButton: ReactNode) => ReactNode
    disabled: boolean,
    additionalHeaderComponent: ReactNode | null
}

type MinorListState<ItemType> = {
    items: ItemType[]
}