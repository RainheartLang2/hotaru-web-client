import AdminApplicationState, {
    EDITED_EMPLOYEE_FIRST_NAME,
    EDITED_EMPLOYEE_LAST_NAME, EDITED_EMPLOYEE_MIDDLE_NAME
} from "../state/AdminApplicationState";
import {sendDeleteRequestToServer, sendGetRequestToServer, sendPostRequestToServer} from "../../core/utils/HttpUtils";
import {ADD_EMPLOYEE, DELETE_EMPLOYEE, GET_ALL_EMPLOYEES} from "../../common/backApplication/ServerAppUrl";
import {plainToClass} from "class-transformer";
import {Employee} from "../../common/beans/Employee";
import {DialogType} from "../state/DialogType";
import ApplicationController from "../../core/mvc/ApplicationController";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static INSTANCE: AdminAppController = new AdminAppController()

    private constructor() {
        super()
    }

    public static getInstance(): AdminAppController {
        return AdminAppController.INSTANCE
    }

    public subscribe(property: string, component: React.Component, propertyAlias: string = property) {
        this.getApplicationState().subscribe(property, component, propertyAlias)
    }

    public startApplication(): void {
        this.getApplicationState().setApplicationLoading(true)
        this.loadUsersList(() => this.getApplicationState().setApplicationLoading(false))
    }

    public loadUsersList(callback: Function): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(json => {
            this.getApplicationState().setUserList(plainToClass(Employee, json) as Employee[])
            callback()
        }).catch(e => {
            this.handleError(e)
        })
    }

    public openCreateEmployeeDialog(): void {
        this.getApplicationState().setEmployeeFirstName("")
        this.toggleFieldValidation(EDITED_EMPLOYEE_FIRST_NAME, false)
        this.getApplicationState().setEmployeeMiddleName("")
        this.toggleFieldValidation(EDITED_EMPLOYEE_MIDDLE_NAME, false)
        this.getApplicationState().setEmployeeLastName("")
        this.toggleFieldValidation(EDITED_EMPLOYEE_LAST_NAME, false)
        this.getApplicationState().setShowDialog(DialogType.CREATE_EMPLOYEE)
    }

    public closeCurrentDialog(): void {
        this.getApplicationState().setShowDialog(DialogType.NONE)
    }

    public setEmployeeLastName(value: string): void {
        this.getApplicationState().setEmployeeLastName(value)
    }

    public setEmployeeFirstName(value: string): void {
        this.getApplicationState().setEmployeeFirstName(value)
    }

    public setEmployeeMiddleName(value: string): void {
        this.getApplicationState().setEmployeeMiddleName(value)
    }

    public submitCreateEmployeeForm(): void {
        const state = this.getApplicationState()
        const employee: Employee = {
            firstName: state.getEmployeeFirstName(),
            middleName: state.getEmployeeMiddleName(),
            lastName: state.getEmployeeLastName(),
        }
        sendPostRequestToServer(ADD_EMPLOYEE, JSON.stringify(employee)).then(json => {
            this.getApplicationState().addUser(employee)
            this.getApplicationState().setShowDialog(DialogType.NONE)
        }).catch(error => {
            this.handleError(error)
        })
    }

    public deleteEmployee(id: number): void {
        sendDeleteRequestToServer(DELETE_EMPLOYEE, [{
            name: "id",
            value: id,
        }]).then(response => {
            this.getApplicationState().deleteUser(id)
        }).catch(error => {
            this.handleError(error)
        })
    }

    protected getApplicationState(): AdminApplicationState {
        return AdminApplicationState.getInstance()
    }
}