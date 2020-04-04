import * as React from "react";
import {TableBodyCmp, TableCellCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";

export default class UserListPage extends React.Component<{}, UserListPageState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            userlist: [{
                id: 1,
                firstName: "Иван",
                middleName: "Иванович",
                lastName: "Иванов",
                active: true,
            }, {
                id: 2,
                firstName: "Пётр",
                middleName: "Петрович",
                lastName: "Петров",
                active: true,
            }]
        }
    }
    render() {
        return (
            <>
                <TableCmp>
                    <TableHeaderCmp>
                        <TableRowCmp>
                            <TableCellCmp>Имя</TableCellCmp>
                            <TableCellCmp>Отчество</TableCellCmp>
                            <TableCellCmp>Фамилия</TableCellCmp>
                        </TableRowCmp>
                    </TableHeaderCmp>
                    <TableBodyCmp>
                        {this.state.userlist.map(user => {
                            return (<TableRowCmp>
                                <TableCellCmp>{user.firstName}</TableCellCmp>
                                <TableCellCmp>{user.middleName}</TableCellCmp>
                                <TableCellCmp>{user.lastName}</TableCellCmp>
                            </TableRowCmp>)
                    })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }
}

export type UserListPageState = {
    userlist: Employee[],
}