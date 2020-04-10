import ApplicationStore, {FIELD_BASE_POSTFIX, FieldType} from "../../core/mvc/ApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {DialogType} from "./DialogType";
import RequiredFieldValidator from "../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../core/mvc/validators/MaximalLengthValidator";

export default class AdminApplicationState extends ApplicationStore {
    private static INSTANCE: AdminApplicationState

    private constructor() {
        super()
        this.registerProperty(USER_LIST_PROPERTY, [])
        this.registerProperty(IS_APPLICATION_LOADING_PROPERTY, true)
        this.registerProperty(SHOW_DIALOG, DialogType.NONE)

        this.registerField(EDITED_EMPLOYEE_FIRST_NAME, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.registerField(EDITED_EMPLOYEE_MIDDLE_NAME, "", [new MaximalLengthValidator(100)])
        this.registerField(EDITED_EMPLOYEE_LAST_NAME, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.registerSelector(EDIT_EMPLOYEE_FORM_HAS_ERRORS,
            {
                dependsOn: [EDITED_EMPLOYEE_FIRST_NAME,
                    EDITED_EMPLOYEE_MIDDLE_NAME,
                    EDITED_EMPLOYEE_LAST_NAME
                ],
                get: (map: Map<string, any>) => {
                    return this.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_FIRST_NAME).errors.length > 0
                        || this.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_MIDDLE_NAME).errors.length > 0
                        || this.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_LAST_NAME).errors.length > 0
                }
            })
    }

    public static getInstance(): AdminApplicationState {
        if (!AdminApplicationState.INSTANCE) {
            AdminApplicationState.INSTANCE = new AdminApplicationState()
        }
        return AdminApplicationState.INSTANCE
    }

    public getUserList(): Employee[] {
        return this.getPropertyValue(USER_LIST_PROPERTY)
    }

    public setUserList(userList: Employee[]) {
        this.setPropertyValue(USER_LIST_PROPERTY, userList)
    }

    public addUser(user: Employee) {
        const users = this.getUserList()
        users.push(user)
        this.setPropertyValue(USER_LIST_PROPERTY, users)
    }

    public deleteUser(id: number) {
        const users = this.getUserList().filter(user => user.id != id)
        this.setPropertyValue(USER_LIST_PROPERTY, users)
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

    public getEmployeeFirstName(): string {
        return this.getFieldValue<string>(EDITED_EMPLOYEE_FIRST_NAME)
    }

    public setEmployeeFirstName(value: string): void {
        this.setFieldValue(EDITED_EMPLOYEE_FIRST_NAME, value)
    }

    public getEmployeeMiddleName(): string {
        return this.getFieldValue<string>(EDITED_EMPLOYEE_MIDDLE_NAME)
    }

    public setEmployeeMiddleName(value: string): void {
        this.setFieldValue(EDITED_EMPLOYEE_MIDDLE_NAME, value)
    }

    public getEmployeeLastName(): string {
        return this.getFieldValue<string>(EDITED_EMPLOYEE_LAST_NAME)
    }

    public setEmployeeLastName(value: string): void {
        this.setFieldValue(EDITED_EMPLOYEE_LAST_NAME, value)
    }
}

export const USER_LIST_PROPERTY = "userList"
export const IS_APPLICATION_LOADING_PROPERTY = "isApplicationLoading"
export const SHOW_DIALOG = "showDialog"
export const EDITED_EMPLOYEE_FIRST_NAME = "editedEmployeeFirstName"
export const EDITED_EMPLOYEE_MIDDLE_NAME = "editedEmployeeMiddleName"
export const EDITED_EMPLOYEE_LAST_NAME = "editedEmployeeLastName"
export const EDIT_EMPLOYEE_FORM_HAS_ERRORS = "editedEmployeeHasErrors"