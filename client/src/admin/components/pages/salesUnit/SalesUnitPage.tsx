import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import SalesUnit from "../../../../common/beans/SalesUnit";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../../core/components";
import {Link} from "@material-ui/core";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";

var styles = require("./styles.css")

export default class SalesUnitPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            salesUnits: [],
        }
    }

    render() {
        return (<>
            <PageHeader label={(<Message messageKey={"page.salesUnit.title"}/>)}
                        hasButton={false}
                        buttonOnClick={() => {}}/>
            <TableCmp>
                <TableBodyCmp>
                    {this.state.salesUnits.map(unit => {
                        return (
                            <>
                            </>
                        )
                    })}
                </TableBodyCmp>
            </TableCmp>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            salesUnitList: "salesUnits",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

export type Properties = {
    controller: EmployeeAppController
}

export type State = {
    salesUnits: SalesUnit[]
}