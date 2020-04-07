import AdminApplicationState from "../state/AdminApplicationState";
import {sendGetRequestToServer, sendPostRequestToServer} from "../../core/utils/HttpUtils";
import {ADD_EMPLOYEE, GET_ALL_EMPLOYEES} from "../../common/backApplication/ServerAppUrl";
import {plainToClass} from "class-transformer";
import {Employee} from "../../common/beans/Employee";
import {DialogType} from "../state/DialogType";

export default class AdminAppController {
    private static INSTANCE: AdminAppController = new AdminAppController()

    private constructor() {}

    public static getInstance(): AdminAppController {
        return AdminAppController.INSTANCE
    }

    public startApplication(): void {
        this.getApplicationState().setApplicationLoading(true)
        this.loadUsersList(() => this.getApplicationState().setApplicationLoading(false))
    }

    public loadUsersList(callback: Function): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(response => {
            response.json().then(result => {
                this.getApplicationState().setUserList(plainToClass(Employee, result) as Employee[])
                callback()
            })
        })
    }

    public openCreateEmployeeDialog(): void {
        this.getApplicationState().setShowDialog(DialogType.CREATE_EMPLOYEE)
    }

    public closeCurrentDialog(): void {
        this.getApplicationState().setShowDialog(DialogType.NONE)
    }

    public subscribe(property: string, component: React.Component, propertyAlias: string = property) {
        this.getApplicationState().subscribe(property, component, propertyAlias)
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
        sendPostRequestToServer(ADD_EMPLOYEE, JSON.stringify(employee)).then(response => {
            this.getApplicationState().addUser(employee)
            this.getApplicationState().setShowDialog(DialogType.NONE)
        })
    }

    private getApplicationState(): AdminApplicationState {
        return AdminApplicationState.getInstance()
    }
}