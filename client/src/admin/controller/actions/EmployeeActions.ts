import AdminAppController from "../AdminAppController";
import {
    extractData,
    fetchUserZoneRpc,
} from "../../../core/utils/HttpUtils";
import {plainToClass} from "class-transformer";
import {Employee} from "../../../common/beans/Employee";
import {DialogType} from "../../state/DialogType";
import EmployeeNode from "../../state/nodes/EmployeeNode";
import {ErrorHandler} from "../../../core/mvc/ApplicationController";
import {GlobalStateProperty} from "../../state/AdminApplicationState";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";

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
        fetchUserZoneRpc({
            method: RemoteMethods.getAllEmployees,
            successCallback: result => {
                this.node.setUserList(plainToClass(Employee, result) as Employee[])
                callback()
            },
            errorHandler: this.errorHandler
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
        fetchUserZoneRpc({
            method: RemoteMethods.addEmployee,
            params: [employee, login],
            successCallback: (result) => {
                employee.id = +result
                this.node.addUser(employee)
                this.node.setShowDialog(DialogType.None)
            },
            errorHandler: this.errorHandler
        })
    }

    public submitEditEmployeeForm(): void {
        fetchUserZoneRpc({
            method: RemoteMethods.editEmployee,
            params: [
                this.node.buildEmployeeBasedOnFields(),
                this.node.isEmployeeChangePassword()
                    ? this.node.buildLoginBasedOnFields()
                    : null,
            ],
            successCallback: (result) => {
                this.node.updateUser(this.node.buildEmployeeBasedOnFields())
                this.node.setShowDialog(DialogType.None)
            },
            errorHandler: this.errorHandler,
        })
    }

    public deleteEmployee(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteEmployee,
            params: [id],
            successCallback: (result) => this.node.deleteUser(id),
            errorHandler: this.errorHandler,
        })
    }
}