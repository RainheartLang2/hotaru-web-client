import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Client} from "../../../../common/beans/Client";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../../core/components";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import EditIcon from '@material-ui/icons/Edit';
import {IconButton} from "@material-ui/core";

var styles = require("./styles.css")

export default class ClientsPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            clients: [],
        }
    }

    render() {
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.clients.title"}/>)}
                    hasButton={true}
                    buttonOnClick={() => this.props.controller.clientActions.openCreateDialog()}
                />
                <TableCmp>
                    <TableHeaderCmp>
                        <TableRowCmp>
                            <CustomTableCell style={styles.editCell}/>
                            <CustomTableCell style={styles.nameCell}/>
                            <CustomTableCell style={styles.phoneCell}/>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.clients.map((client: Client) => {
                            return (
                                <TableRowCmp>
                                    <CustomTableCell style={styles.editCell}>
                                        <IconButton
                                            className={styles.editIcon}
                                            onClick={() => this.props.controller.clientActions.openEditDialog(client)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.nameCell}>
                                        {client.firstName}
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.phoneCell}>
                                        {client.phone}
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
            permanentClients: "clients",
        })
    }
}

type Properties = {
    controller: EmployeeAppController,
}

type State = {
    clients: Client[]
}