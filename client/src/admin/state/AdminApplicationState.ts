import {DialogType} from "./DialogType";
import EmployeeNode from "./nodes/EmployeeNode";
import ApplicationStore from "../../core/mvc/store/ApplicationStore";
import {Employee} from "../../common/beans/Employee";

export default class AdminApplicationState extends ApplicationStore {
    private static _instance: AdminApplicationState

    private _employeeNode: EmployeeNode

    private constructor() {
        super()
        this.registerProperty(AdminStateProperty.IsApplicationLoading, true)
        this.registerProperty(AdminStateProperty.ShowDialog, DialogType.None)
        this.registerProperty(AdminStateProperty.LoggedInEmployee, null)
        this._employeeNode = new EmployeeNode(this.friend)
    }

    get employeeNode(): EmployeeNode {
        return this._employeeNode;
    }

    public static get instance(): AdminApplicationState {
        if (!AdminApplicationState._instance) {
            AdminApplicationState._instance = new AdminApplicationState()
        }
        return AdminApplicationState._instance
    }

    public isApplicationLoading(): boolean {
        return this.getPropertyValue(AdminStateProperty.IsApplicationLoading)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.setPropertyValue(AdminStateProperty.IsApplicationLoading, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.getPropertyValue(AdminStateProperty.ShowDialog)
    }

    public setShowDialog(dialogType: DialogType): void {
        this.setPropertyValue(AdminStateProperty.ShowDialog, dialogType)
    }

    public getLoggedInUser(): Employee {
        return this.getPropertyValue<Employee>(AdminStateProperty.LoggedInEmployee)
    }

    public setLoggedInUser(employee: Employee): void {
        this.setPropertyValue<Employee>(AdminStateProperty.LoggedInEmployee, employee)
    }
}

export enum AdminStateProperty {
    IsApplicationLoading = "isApplicationLoading",
    LoggedInEmployee = "LoggedInEmployee",
    ShowDialog = "showDialog",
    UserList = "userList",
    UserListById = "userListById",
    EmployeeDialogType = "employeeDialogType",
    EditedEmployeeId = "editedEmployeeId",
    EditedEmployeeFirstName = "editedEmployeeFirstName",
    EditedEmployeeMiddleName = "editedEmployeeMiddleName",
    EditedEmployeeLastName = "editedEmployeeLastName",
    EditedEmployeeActive = "editedEmployeeActive",
    EditedEmployeePhone = "editedEmployeePhone",
    EditedEmployeeEmail = "editedEmployeeEmail",
    EditedEmployeeAddress = "editedEmployeeAddress",
    EditedEmployeeLogin = "editedEmployeLogin",
    EditedEmployeePassword = "editedEmployeePassword",
    EditedEmployeeConfirmPassword = "editedEmployeeConfirmPassword",
    IsEmployeeChangePassword = "isEmployeeChangePassword",
    IsChangePasswordButtonShow = "isChangePasswordButtonShow",
    IsChangePasswordObligatory = "IsChangePasswordObligatory",
    EditEmployeeFormHasErrors = "editEmployeFormHasErrors",
}