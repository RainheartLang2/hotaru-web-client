import * as React from "react";
import GoodsPack from "../../beans/GoodsPack";
import MinorList from "../list/MinorList";
import ControlledMinorList from "../list/controlled/ControlledMinorList";
import {ReactNode} from "react";
import {ListItemText} from "@material-ui/core";
import ListItemSecondaryAction from "../../../admin/components/dialogs/goodsDocument/EditGoodsDocumentForm";
import {Message} from "../../../core/components/Message";

export default class GoodsList extends React.Component<Properties, State> {

    render() {
        return (
            <ControlledMinorList<GoodsPack>
                label={this.props.label}
                addButton={false}
                itemsList={this.props.goods}
                renderItem={item => {
                    return (<>
                        <ListItemText primary={""}/>
                    </>)
                }}
            />
        )
    }

}

type Properties = {
    label: ReactNode
    goods: GoodsPack[]
}

type State = {

}