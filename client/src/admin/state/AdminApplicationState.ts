import ApplicationStore, {FIELD_BASE_POSTFIX, FieldType} from "../../core/mvc/ApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {DialogType} from "./DialogType";
import RequiredFieldValidator from "../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../core/mvc/validators/MaximalLengthValidator";
import EmployeeNode from "./nodes/EmployeeNode";

export default class AdminApplicationState extends ApplicationStore {
    private static INSTANCE: AdminApplicationState

    private _employeeNode: EmployeeNode

    private constructor() {
        super()
        this.registerProperty(IS_APPLICATION_LOADING_PROPERTY, true)
        this.registerProperty(SHOW_DIALOG, DialogType.NONE)

        this._employeeNode = new EmployeeNode(this)
    }

    get employeeNode(): EmployeeNode {
        return this._employeeNode;
    }

    public static getInstance(): AdminApplicationState {
        if (!AdminApplicationState.INSTANCE) {
            AdminApplicationState.INSTANCE = new AdminApplicationState()
        }
        return AdminApplicationState.INSTANCE
    }

    public isApplicationLoading(): boolean {
        return this.getPropertyValue(IS_APPLICATION_LOADING_PROPERTY)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.setPropertyValue(IS_APPLICATION_LOADING_PROPERTY, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.getPropertyValue(SHOW_DIALOG)
    }

    public setShowDialog(dialogType: DialogType): void {
        this.setPropertyValue(SHOW_DIALOG, dialogType)
    }
}

export const USER_LIST_PROPERTY = "userList"
export const IS_APPLICATION_LOADING_PROPERTY = "isApplicationLoading"
export const SHOW_DIALOG = "showDialog"
export const EDITED_EMPLOYEE_FIRST_NAME = "editedEmployeeFirstName"
export const EDITED_EMPLOYEE_MIDDLE_NAME = "editedEmployeeMiddleName"
export const EDITED_EMPLOYEE_LAST_NAME = "editedEmployeeLastName"
export const EDIT_EMPLOYEE_FORM_HAS_ERRORS = "editedEmployeeHasErrors"