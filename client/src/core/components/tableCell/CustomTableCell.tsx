import * as React from "react";
import {TableCellCmp} from "../../components";

export default class CustomTableCell extends React.Component<Properties> {
    render() {
        return (
            <TableCellCmp>
                <div className={this.props.style}>
                    {this.props.children}
                </div>
            </TableCellCmp>
        )
    }
}

type Properties = {
    style?: string,
}