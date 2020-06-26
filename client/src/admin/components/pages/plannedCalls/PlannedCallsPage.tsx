import EmployeeAppController from "../../../controller/EmployeeAppController";
import PlannedCall from "../../../../common/beans/PlannedCall";
import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../../core/components";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import CustomLink from "../../../../core/components/customLink/CustomLink";

var styles = require("../schedule/styles.css")

export default class PlannedCallsPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            calls: []
        }
    }

    render() {
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.plannedCalls.title"}/>)}
                    hasButton={true}
                    buttonOnClick={() => this.props.controller.plannedCallActions.openCreateForm()}
                />
                <TableCmp>
                    <TableHeaderCmp>
                        <TableRowCmp>
                            <CustomTableCell style={styles.nameCell}/>
                            <CustomTableCell style={styles.actionsCell}/>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.calls.map((call: PlannedCall) => {
                            return (
                                <TableRowCmp>
                                    <CustomTableCell style={styles.nameCell}>
                                        <CustomLink
                                            onClick={() => this.props.controller.plannedCallActions.openEditForm(call)}
                                        >
                                            {call.id}
                                        </CustomLink>
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actionsCell}>
                                        <CustomContentButton
                                            onClick={() => {}}
                                            tooltipContent={<Message messageKey={"common.button.delete"}/>}
                                        >
                                            Удалить
                                        </CustomContentButton>
                                    </CustomTableCell>
                                </TableRowCmp>
                            )
                        })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            plannedCalls: "calls",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    calls: PlannedCall[]
}