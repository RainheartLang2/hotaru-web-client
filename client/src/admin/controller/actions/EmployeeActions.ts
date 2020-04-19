import AdminAppController from "../AdminAppController";
import {
    sendDeleteRequestToServer,
    sendGetRequestToServer,
    sendPostRequestToServer
} from "../../../core/utils/HttpUtils";
import {plainToClass} from "class-transformer";
import {Employee} from "../../../common/beans/Employee";
import {DialogType} from "../../state/DialogType";
import EmployeeNode from "../../state/nodes/EmployeeNode";
import {ErrorHandler} from "../../../core/mvc/ApplicationController";
import {GlobalStateProperty} from "../../state/AdminApplicationState";
import {ServerAppUrls} from "../../../common/backApplication/ServerAppUrls";
import {CommonUtils} from "../../../core/utils/CommonUtils";

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
        sendGetRequestToServer(ServerAppUrls.getAllEmployees).then(json => {
            this.node.setUserList(plainToClass(Employee, json) as Employee[])
            callback()
        }).catch(e => {
            this.errorHandler.handle(e)
        })
    }

    public openCreateEmployeeDialog(): void {
        this.node.setShowDialog(DialogType.CreateEmployee)

        this.node.setEmployeeFirstName("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeFirstName, false)

        this.node.setEmployeeMiddleName("")

        this.node.setEmployeeLastName("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeLastName, false)

        this.node.setEmployeeActive(true)
        this.node.setEmployeePhone("")
        this.node.setEmployeeMail("")
        this.node.setEmployeeAddress("")
        this.node.setEmployeeLogin("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeLogin, false)
        this.node.setEmployeePassword("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeePassword, false)
        this.node.setEmployeeConfirmPassword("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeConfirmPassword, false)
    }

    public openEditEmployeeDialog(user: Employee): void {
        this.node.setShowDialog(DialogType.EditEmployee)
        this.node.setEmployeeId(user.id ? user.id : 0)
        this.node.setEmployeeFirstName(user.firstName ? user.firstName : "")
        this.node.setEmployeeMiddleName(user.middleName ? user.middleName : "")
        this.node.setEmployeeLastName(user.lastName ? user.lastName : "")
        this.node.setEmployeeActive(user.active != null ? user.active : true)
        this.node.setEmployeePhone(user.phone != null ? user.phone : "")
        this.node.setEmployeeMail(user.email != null ? user.email : "")
        this.node.setEmployeeAddress(user.address != null ? user.address : "")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeLogin, false)
        this.node.setEmployeePassword("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeePassword, false)
        this.node.setEmployeeConfirmPassword("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeConfirmPassword, false)
    }

    public setEmployeeActive(value: boolean): void {
        this.node.setEmployeeActive(value)
    }

    public setChangePassword(value: boolean): void {
        this.node.setEmployeeChangePassword(value)
    }

    public submitCreateEmployeeForm(): void {
        const employee = this.node.buildEmployeeBasedOnFields()
        const login = this.node.buildLoginBasedOnFields()
        sendPostRequestToServer(ServerAppUrls.addEmployee, JSON.stringify({employee, login})).then(id => {
            employee.id = id
            this.node.addUser(employee)
            this.node.setShowDialog(DialogType.None)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }

    public submitEditEmployeeForm(): void {
        sendPostRequestToServer(ServerAppUrls.editEmployee,
                                JSON.stringify({
                                    employee: this.node.buildEmployeeBasedOnFields(),
                                    login: this.node.isEmployeeChangePassword()
                                        ? this.node.buildLoginBasedOnFields()
                                        : null,
                                })
        ).then(result => {
            this.node.updateUser(this.node.buildEmployeeBasedOnFields())
            this.node.setShowDialog(DialogType.None)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }

    public deleteEmployee(id: number): void {
        sendDeleteRequestToServer(ServerAppUrls.deleteEmployee, [{
            name: "id",
            value: id,
        }]).then(response => {
            this.node.deleteUser(id)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }
}