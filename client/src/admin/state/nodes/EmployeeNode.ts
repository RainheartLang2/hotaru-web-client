import AdminApplicationState, {
    EDIT_EMPLOYEE_FORM_HAS_ERRORS,
    EDITED_EMPLOYEE_FIRST_NAME,
    EDITED_EMPLOYEE_LAST_NAME,
    EDITED_EMPLOYEE_MIDDLE_NAME,
    IS_APPLICATION_LOADING_PROPERTY,
    SHOW_DIALOG,
    USER_LIST_PROPERTY
} from "../AdminApplicationState";
import {DialogType} from "../DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {FieldType} from "../../../core/mvc/ApplicationStore";
import {Employee} from "../../../common/beans/Employee";

export default class EmployeeNode {
    private store: AdminApplicationState

    constructor(store: AdminApplicationState) {
        this.store = store

        this.store.registerProperty(USER_LIST_PROPERTY, [])

        this.store.registerField(EDITED_EMPLOYEE_FIRST_NAME, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(EDITED_EMPLOYEE_MIDDLE_NAME, "", [new MaximalLengthValidator(100)])
        this.store.registerField(EDITED_EMPLOYEE_LAST_NAME, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerSelector(EDIT_EMPLOYEE_FORM_HAS_ERRORS,
            {
                dependsOn: [EDITED_EMPLOYEE_FIRST_NAME,
                    EDITED_EMPLOYEE_MIDDLE_NAME,
                    EDITED_EMPLOYEE_LAST_NAME
                ],
                get: (map: Map<string, any>) => {
                    return this.store.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_FIRST_NAME).errors.length > 0
                        || this.store.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_MIDDLE_NAME).errors.length > 0
                        || this.store.getPropertyValue<FieldType<string>>(EDITED_EMPLOYEE_LAST_NAME).errors.length > 0
                }
            })
    }

    public getUserList(): Employee[] {
        return this.store.getPropertyValue(USER_LIST_PROPERTY)
    }

    public setUserList(userList: Employee[]) {
        this.store.setPropertyValue(USER_LIST_PROPERTY, userList)
    }

    public addUser(user: Employee) {
        const users = this.getUserList()
        users.push(user)
        this.store.setPropertyValue(USER_LIST_PROPERTY, users)
    }

    public deleteUser(id: number) {
        const users = this.getUserList().filter(user => user.id != id)
        this.store.setPropertyValue(USER_LIST_PROPERTY, users)
    }

    public isApplicationLoading(): boolean {
        return this.store.getPropertyValue(IS_APPLICATION_LOADING_PROPERTY)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.store.setPropertyValue(IS_APPLICATION_LOADING_PROPERTY, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.store.getPropertyValue(SHOW_DIALOG)
    }

    public setShowDialog(dialogType: DialogType): void {
        this.store.setPropertyValue(SHOW_DIALOG, dialogType)
    }

    public getEmployeeFirstName(): string {
        return this.store.getFieldValue<string>(EDITED_EMPLOYEE_FIRST_NAME)
    }

    public setEmployeeFirstName(value: string): void {
        this.store.setFieldValue(EDITED_EMPLOYEE_FIRST_NAME, value)
    }

    public getEmployeeMiddleName(): string {
        return this.store.getFieldValue<string>(EDITED_EMPLOYEE_MIDDLE_NAME)
    }

    public setEmployeeMiddleName(value: string): void {
        this.store.setFieldValue(EDITED_EMPLOYEE_MIDDLE_NAME, value)
    }

    public getEmployeeLastName(): string {
        return this.store.getFieldValue<string>(EDITED_EMPLOYEE_LAST_NAME)
    }

    public setEmployeeLastName(value: string): void {
        this.store.setFieldValue(EDITED_EMPLOYEE_LAST_NAME, value)
    }
}
