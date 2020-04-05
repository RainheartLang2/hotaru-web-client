import * as React from "react";
import {TableBodyCmp, TableCellCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../core/components";
import {Employee} from "../../../common/beans/Employee";
import {plainToClass} from "class-transformer";
import {sendGetRequestToServer, fetchHttpGet} from "../../../core/utils/HttpUtils";
import {GET_ALL_EMPLOYEES} from "../../../common/backApplication/ServerAppUrl";

export default class UserListPage extends React.Component<{}, UserListPageState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            userlist: []
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
                            return (<TableRowCmp key={user.id}>
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

    componentDidMount(): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(response => {
            response.json().then(result => {
                this.setState({
                    userlist: plainToClass(Employee, result) as Employee[],
                })
            })
        })
    }
}

export type UserListPageState = {
    userlist: Employee[],
}