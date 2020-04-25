import * as React from "react";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import AdminAppController from "../../controller/AdminAppController";
import PageHeader from "../../../common/components/pageHeader/PageHeader";
import {Link} from "@material-ui/core";
import {Message} from "../../../core/components/Message";
import EmployeeActions from "../../controller/actions/EmployeeActions";
import CustomTableCell from "../../../core/components/tableCell/CustomTableCell";
import ActivityCell from "../../../core/components/activityCell/ActivityCell";

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

    private delete(userId?: number): void {
        if (userId) {
            this.actions.deleteEmployee(userId)
        } else {
            throw new Error("user has no id")
        }
    }

    private getUserMiddleName(user: Employee): string {
        return user.middleName ? user.middleName : ""
    }
    private getUserName(user: Employee): string {
        return `${user.lastName}, ${user.firstName} ${this.getUserMiddleName(user)}`
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
                            <CustomTableCell style={styles.nameCell}>
                                <Message messageKey={"common.employee.name"}/>
                            </CustomTableCell>
                            <CustomTableCell style={styles.activeCell}/>
                            <CustomTableCell style={styles.actionCell}>
                                <Message messageKey={"common.label.actions"}/>
                            </CustomTableCell>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state[StateProperty.UserList].map(user => {
                            return (<TableRowCmp key={user.id}>
                                <CustomTableCell style={styles.nameCell}>
                                    <Link
                                        color="primary"
                                        onClick={() => this.actions.openEditEmployeeDialog(user)}
                                    >
                                        {this.getUserName(user)}
                                    </Link>
                                </CustomTableCell>
                                <CustomTableCell style={styles.activeCell}>
                                    <ActivityCell isActive={user.active}/>
                                </CustomTableCell>
                                <CustomTableCell style={styles.actionsCell}>
                                    <Link
                                        color="primary"
                                        onClick={() => this.delete(user.id)}
                                    >
                                        <Message messageKey={"common.button.delete"}/>
                                    </Link>
                                </CustomTableCell>
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