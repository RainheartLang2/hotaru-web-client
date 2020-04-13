import {DialogType} from "./DialogType";
import EmployeeNode from "./nodes/EmployeeNode";
import ApplicationStore from "../../core/mvc/store/ApplicationStore";

export default class AdminApplicationState extends ApplicationStore {
    private static _instance: AdminApplicationState

    private _employeeNode: EmployeeNode

    private constructor() {
        super()
        this.registerProperty(GlobalStateProperty.IsApplicationLoading, true)
        this.registerProperty(GlobalStateProperty.ShowDialog, DialogType.None)
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
        return this.getPropertyValue(GlobalStateProperty.IsApplicationLoading)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.setPropertyValue(GlobalStateProperty.IsApplicationLoading, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.getPropertyValue(GlobalStateProperty.ShowDialog)
    }

    public setShowDialog(dialogType: DialogType): void {
        this.setPropertyValue(GlobalStateProperty.ShowDialog, dialogType)
    }
}

export enum GlobalStateProperty {
    IsApplicationLoading = "isApplicationLoading",
    ShowDialog = "showDialog",
    UserList = "userList",
    UserListById = "userListById",
    EmployeeDialogType = "employeeDialogType",
    EditedEmployeeId = "editedEmployeeId",
    EditedEmployeeFirstName = "editedEmployeeFirstName",
    EditedEmployeeMiddleName = "editedEmployeeMiddleName",
    EditedEmployeeLastName = "editedEmployeeLastName",
    EditedEmployeeActive = "editedEmployeeActive",
    EditEmployeeFormHasErrors = "editEmployeFormHasErrors"
}