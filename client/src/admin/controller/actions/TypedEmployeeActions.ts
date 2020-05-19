import TypedEmployeeNode from "../../state/nodes/TypedEmployeeNode";
import EmployeeAppController from "../EmployeeAppController";
import {Employee} from "../../../common/beans/Employee";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";

export default class TypedEmployeeActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadUsersList(callback: (employees: Employee[]) => void = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllEmployees,
            successCallback: result => {
                this.controller.setState({userList: result})
                callback(result)
            },
        })
    }
}