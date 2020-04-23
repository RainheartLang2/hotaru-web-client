import * as React from "react";
import {TableBodyCmp, TableCellCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import AdminAppController from "../../controller/AdminAppController";
import PageHeader from "../../../common/components/pageHeader/PageHeader";
import {Link} from "@material-ui/core";
import {Message} from "../../../core/components/Message";
import EmployeeActions from "../../controller/actions/EmployeeActions";

var styles = require("./styles.css");

export default class UserListPage extends React.Component<{}, UserListPageState> {

    private actions: EmployeeActions

    constructor(props: {}) {
        super(props)
        this.state = {
            [StateProperty.UserList]: []
        }
        this.actions = AdminAppController.instance.employeeActions
    }

    render() {
        return (
            <>
                <PageHeader label={(<Message messageKey={"page.userList.title"}/>)}
                            hasButton={true}
                            buttonOnClick={() => this.actions.openCreateEmployeeDialog()}/>
                <TableCmp>
                    <TableHeaderCmp>
                        <TableRowCmp>
                            <TableCellCmp>
                                <Message messageKey={"common.employee.name"}/>
                            </TableCellCmp>
                            <TableCellCmp/>
                            <TableCellCmp>
                                <Message messageKey={"common.label.actions"}/>
                            </TableCellCmp>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.userList.map(user => {
                            return (<TableRowCmp key={user.id}>
                                <TableCellCmp>
                                    <Link
                                        color="primary"
                                        onClick={() => this.actions.openEditEmployeeDialog(user)}
                                    >
                                        {`${user.lastName}, ${user.firstName} ${user.middleName}`}
                                    </Link>
                                </TableCellCmp>
                                <TableCellCmp>
                                    <div className={user.active ? styles.activeLabel : styles.notActiveLabel}>
                                        <Message messageKey={user.active
                                            ? "dialog.employee.control.active.label"
                                            : "dialog.employee.control.notActive.label"}
                                        />
                                    </div>
                                </TableCellCmp>
                                <TableCellCmp>
                                    <Link
                                        color="primary"
                                        onClick={() => {
                                            if (user.id) {
                                                this.actions.deleteEmployee(user.id)
                                            } else {
                                                throw new Error("user has no id")
                                            }
                                        }}
                                    >
                                        <Message messageKey={"common.button.delete"}/>
                                    </Link>
                                </TableCellCmp>
                            </TableRowCmp>)
                        })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        AdminAppController.instance.subscribe(AdminStateProperty.UserList, this, StateProperty.UserList)
    }
}

enum StateProperty {
    UserList = "userList"
}

export type UserListPageState = {
    [StateProperty.UserList]: Employee[],
}