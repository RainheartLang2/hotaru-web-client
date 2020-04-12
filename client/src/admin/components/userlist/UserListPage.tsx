import * as React from "react";
import {TableBodyCmp, TableCellCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {GlobalStateProperty} from "../../state/AdminApplicationState";
import AdminAppController from "../../controller/AdminAppController";
import PageHeader from "../../../common/components/pageHeader/PageHeader";
import {Button} from "@material-ui/core";
import {Message} from "../../../core/components/Message";
import EmployeeActions from "../../controller/actions/EmployeeActions";

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
                            <TableCellCmp>
                                <Message messageKey={"common.label.actions"}/>
                            </TableCellCmp>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.userList.map(user => {
                            return (<TableRowCmp key={user.id}>
                                <TableCellCmp>{`${user.lastName}, ${user.firstName} ${user.middleName}`}</TableCellCmp>
                                <TableCellCmp>
                                    <Button
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
                                    </Button>
                                </TableCellCmp>
                            </TableRowCmp>)
                        })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        AdminAppController.instance.subscribe(GlobalStateProperty.UserList, this, StateProperty.UserList)
    }
}

enum StateProperty {
    UserList = "userList"
}

export type UserListPageState = {
    [StateProperty.UserList]: Employee[],
}