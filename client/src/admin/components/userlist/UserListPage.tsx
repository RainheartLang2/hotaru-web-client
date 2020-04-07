import * as React from "react";
import {
    TableBodyCmp,
    TableCellCmp,
    TableCmp,
    TableHeaderCmp,
    TableRowCmp
} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {USER_LIST_PROPERTY} from "../../state/AdminApplicationState";
import AdminAppController from "../../controller/AdminAppController";
import PageHeader from "../../../common/components/pageHeader/PageHeader";
import {Button} from "@material-ui/core";

export default class UserListPage extends React.Component<{}, UserListPageState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            [USER_LIST_PROPERTY]: []
        }
    }

    render() {
        return (
            <>
                <PageHeader label={"Пользователи"}
                            hasButton={true}
                            buttonOnClick={() => AdminAppController.getInstance().openCreateEmployeeDialog()}/>
                <TableCmp>
                    <TableHeaderCmp>
                        <TableRowCmp>
                            <TableCellCmp>Имя</TableCellCmp>
                            <TableCellCmp>Отчество</TableCellCmp>
                            <TableCellCmp>Фамилия</TableCellCmp>
                            <TableCellCmp>Действия</TableCellCmp>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.userList.map(user => {
                            return (<TableRowCmp key={user.id}>
                                <TableCellCmp>{user.firstName}</TableCellCmp>
                                <TableCellCmp>{user.middleName}</TableCellCmp>
                                <TableCellCmp>{user.lastName}</TableCellCmp>
                                <TableCellCmp>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            if (user.id) {
                                                AdminAppController.getInstance().deleteEmployee(user.id)
                                            } else {
                                                throw new Error("user has no id")
                                            }
                                        }}
                                    >
                                        Удалить
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
        AdminAppController.getInstance().subscribe(USER_LIST_PROPERTY, this)
    }
}

export type UserListPageState = {
    [USER_LIST_PROPERTY]: Employee[],
}