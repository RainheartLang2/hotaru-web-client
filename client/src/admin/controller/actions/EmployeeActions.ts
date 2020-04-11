import AdminAppController from "../AdminAppController";
import {
    EDITED_EMPLOYEE_FIRST_NAME,
    EDITED_EMPLOYEE_LAST_NAME,
    EDITED_EMPLOYEE_MIDDLE_NAME
} from "../../state/AdminApplicationState";
import {
    sendDeleteRequestToServer,
    sendGetRequestToServer,
    sendPostRequestToServer
} from "../../../core/utils/HttpUtils";
import {ADD_EMPLOYEE, DELETE_EMPLOYEE, GET_ALL_EMPLOYEES} from "../../../common/backApplication/ServerAppUrl";
import {plainToClass} from "class-transformer";
import {Employee} from "../../../common/beans/Employee";
import {DialogType} from "../../state/DialogType";
import EmployeeNode from "../../state/nodes/EmployeeNode";
import {ErrorHandler} from "../../../core/mvc/ApplicationController";

export default class EmployeeActions {
    private controller: AdminAppController
    private errorHandler: ErrorHandler
    private node: EmployeeNode

    constructor(controller: AdminAppController,
                errorHandler: ErrorHandler,
                store: EmployeeNode) {
        this.controller = controller
        this.errorHandler = errorHandler
        this.node = store;
    }

    public loadUsersList(callback: Function): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(json => {
            this.node.setUserList(plainToClass(Employee, json) as Employee[])
            callback()
        }).catch(e => {
            this.errorHandler.handle(e)
        })
    }

    public openCreateEmployeeDialog(): void {
        this.node.setEmployeeFirstName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_FIRST_NAME, false)

        this.node.setEmployeeMiddleName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_MIDDLE_NAME, false)

        this.node.setEmployeeLastName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_LAST_NAME, false)

        this.node.setShowDialog(DialogType.CREATE_EMPLOYEE)
    }

    public setEmployeeLastName(value: string): void {
        this.node.setEmployeeLastName(value)
    }

    public setEmployeeFirstName(value: string): void {
        this.node.setEmployeeFirstName(value)
    }

    public setEmployeeMiddleName(value: string): void {
        this.node.setEmployeeMiddleName(value)
    }

    public submitCreateEmployeeForm(): void {
        const employee: Employee = {
            firstName: this.node.getEmployeeFirstName(),
            middleName: this.node.getEmployeeMiddleName(),
            lastName: this.node.getEmployeeLastName(),
        }
        sendPostRequestToServer(ADD_EMPLOYEE, JSON.stringify(employee)).then(json => {
            this.node.addUser(employee)
            this.node.setShowDialog(DialogType.NONE)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }

    public deleteEmployee(id: number): void {
        sendDeleteRequestToServer(DELETE_EMPLOYEE, [{
            name: "id",
            value: id,
        }]).then(response => {
            this.node.deleteUser(id)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }
}