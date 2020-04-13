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
        this.node.setEmployeeFirstName("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeFirstName, false)

        this.node.setEmployeeMiddleName("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeMiddleName, false)

        this.node.setEmployeeLastName("")
        this.controller.toggleFieldValidation(GlobalStateProperty.EditedEmployeeLastName, false)

        this.node.setShowDialog(DialogType.CreateEmployee)
    }

    public openEditEmployeeDialog(user: Employee): void {
        this.node.setEmployeeId(user.id ? user.id : 0)
        this.node.setEmployeeFirstName(user.firstName ? user.firstName : "")
        this.node.setEmployeeMiddleName(user.middleName ? user.middleName : "")
        this.node.setEmployeeLastName(user.lastName ? user.lastName : "")
        this.node.setShowDialog(DialogType.EditEmployee)
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
        const employee = this.node.buildEmployeeBasedOnFields()
        sendPostRequestToServer(ServerAppUrls.addEmployee, JSON.stringify(employee)).then(id => {
            employee.id = id
            this.node.addUser(employee)
            this.node.setShowDialog(DialogType.None)
        }).catch(error => {
            this.errorHandler.handle(error)
        })
    }

    public submitEditEmployeeForm(): void {
        const sourceEmployee = this.node.getEditedEmployee()
        const resultEmployee = {
            id: this.node.getEmployeeId(),
            firstName: CommonUtils.valueIfDiffers(this.node.getEmployeeFirstName(), sourceEmployee.firstName),
            middleName: CommonUtils.valueIfDiffers(this.node.getEmployeeMiddleName(), sourceEmployee.middleName),
            lastName: CommonUtils.valueIfDiffers(this.node.getEmployeeLastName(), sourceEmployee.lastName),
        }

        if (!this.node.isEmployeeFormChanged()) {
            return
        }

        sendPostRequestToServer(ServerAppUrls.editEmployee, JSON.stringify(resultEmployee)).then(result => {
            this.node.updateUser(this.node.buildEmployeeBasedOnFields())
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