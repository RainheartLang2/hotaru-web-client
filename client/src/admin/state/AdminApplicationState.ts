import {DialogType} from "./DialogType";
import EmployeeNode from "./nodes/EmployeeNode";
import ApplicationStore from "../../core/mvc/store/ApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {PageType} from "./PageType";
import {NavigationMenuType} from "./NavigationMenuType";

export default class AdminApplicationState extends ApplicationStore {
    private static _instance: AdminApplicationState

    private _employeeNode: EmployeeNode

    private constructor() {
        super()
        this.registerProperty(AdminStateProperty.IsApplicationLoading, true)
        this.registerProperty(AdminStateProperty.PageType, PageType.None)
        this.registerProperty(AdminStateProperty.DialogType, DialogType.None)
        this.registerSelector(AdminStateProperty.NavigationMenuType, {
            dependsOn: [AdminStateProperty.PageType],
            get: map => {
                switch (this.getPropertyValue(AdminStateProperty.PageType)) {
                    case PageType.UserList: return NavigationMenuType.UserList
                    case PageType.ClinicList: return NavigationMenuType.ClinicList
                    default: return NavigationMenuType.None
                }
            }
        })
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

    public setDialogType(dialogType: DialogType): void {
        this.setPropertyValue(AdminStateProperty.DialogType, dialogType)
    }

    public setPageType(pageType: PageType): void {
        this.setPropertyValue<PageType>(AdminStateProperty.PageType, pageType)
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
    NavigationMenuType = "navigationMenuType",
    PageType = "pageType",
    DialogType = "dialogType",
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