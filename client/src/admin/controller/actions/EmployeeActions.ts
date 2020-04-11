import AdminAppController from "../AdminAppController";
import AdminApplicationState, {
    EDITED_EMPLOYEE_FIRST_NAME, EDITED_EMPLOYEE_LAST_NAME,
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

export default class EmployeeActions {
    private controller: AdminAppController
    private store: AdminApplicationState

    constructor(controller: AdminAppController, store: AdminApplicationState) {
        this.controller = controller;
        this.store = store;
    }

    public loadUsersList(callback: Function): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(json => {
            this.store.setUserList(plainToClass(Employee, json) as Employee[])
            callback()
        }).catch(e => {
            this.controller.handleError(e)
        })
    }

    public openCreateEmployeeDialog(): void {
        this.store.setEmployeeFirstName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_FIRST_NAME, false)

        this.store.setEmployeeMiddleName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_MIDDLE_NAME, false)

        this.store.setEmployeeLastName("")
        this.controller.toggleFieldValidation(EDITED_EMPLOYEE_LAST_NAME, false)

        this.store.setShowDialog(DialogType.CREATE_EMPLOYEE)
    }

    public setEmployeeLastName(value: string): void {
        this.store.setEmployeeLastName(value)
    }

    public setEmployeeFirstName(value: string): void {
        this.store.setEmployeeFirstName(value)
    }

    public setEmployeeMiddleName(value: string): void {
        this.store.setEmployeeMiddleName(value)
    }

    public submitCreateEmployeeForm(): void {
        const employee: Employee = {
            firstName: this.store.getEmployeeFirstName(),
            middleName: this.store.getEmployeeMiddleName(),
            lastName: this.store.getEmployeeLastName(),
        }
        sendPostRequestToServer(ADD_EMPLOYEE, JSON.stringify(employee)).then(json => {
            this.store.addUser(employee)
            this.store.setShowDialog(DialogType.NONE)
        }).catch(error => {
            this.controller.handleError(error)
        })
    }

    public deleteEmployee(id: number): void {
        sendDeleteRequestToServer(DELETE_EMPLOYEE, [{
            name: "id",
            value: id,
        }]).then(response => {
            this.store.deleteUser(id)
        }).catch(error => {
            this.controller.handleError(error)
        })
    }
}