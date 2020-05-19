import * as React from "react";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import AdminAppController from "../../controller/AdminAppController";
import PageHeader from "../../../common/components/pageHeader/PageHeader";
import {Link} from "@material-ui/core";
import {Message} from "../../../core/components/Message";
import CustomTableCell from "../../../core/components/tableCell/CustomTableCell";
import ActivityCell from "../../../core/components/activityCell/ActivityCell";
import EmployeeAppController from "../../controller/EmployeeAppController";

var styles = require("./styles.css");

export default class UserListPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            userList: []
        }
    }

    private delete(userId?: number): void {
        // if (userId) {
        //     this.actions.deleteEmployee(userId)
        // } else {
        //     throw new Error("user has no id")
        // }
    }

    private getUserMiddleName(user: Employee): string {
        return user.middleName ? user.middleName : ""
    }
    private getUserName(user: Employee): string {
        return `${user.lastName}, ${user.firstName} ${this.getUserMiddleName(user)}`
    }

    render() {
        console.log(this.state.userList)
        return (
            <>
                <PageHeader label={(<Message messageKey={"page.userList.title"}/>)}
                            hasButton={true}
                            buttonOnClick={() => {}}/>
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
                        {this.state.userList.map(user => {
                            return (<TableRowCmp key={user.id}>
                                <CustomTableCell style={styles.nameCell}>
                                    <Link
                                        color="primary"
                                        onClick={() => {}}
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
        this.props.controller.subscribe(this, {
            userList: "userList",
        })
    }

    componentWillUnmount(): void {
        AdminAppController.instance.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}
type State = {
    userList: Employee[],
}