import {DialogType} from "../DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {Employee} from "../../../common/beans/Employee";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {GlobalStateProperty} from "../AdminApplicationState";
import {Field} from "../../../core/mvc/store/Field";

export default class EmployeeNode {
    private store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(GlobalStateProperty.UserList, [])

        this.store.registerField(GlobalStateProperty.EditedEmployeeFirstName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(GlobalStateProperty.EditedEmployeeMiddleName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(GlobalStateProperty.EditedEmployeeLastName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerSelector(GlobalStateProperty.EditEmployeeFormHasErrors,
            {
                dependsOn: [GlobalStateProperty.EditedEmployeeFirstName,
                    GlobalStateProperty.EditedEmployeeMiddleName,
                    GlobalStateProperty.EditedEmployeeLastName
                ],
                get: (map: Map<string, any>) => {
                    return this.store.getPropertyValue<Field<string>>(GlobalStateProperty.EditedEmployeeFirstName).errors.length > 0
                        || this.store.getPropertyValue<Field<string>>(GlobalStateProperty.EditedEmployeeMiddleName).errors.length > 0
                        || this.store.getPropertyValue<Field<string>>(GlobalStateProperty.EditedEmployeeLastName).errors.length > 0
                }
            })
    }

    public getUserList(): Employee[] {
        return this.store.getPropertyValue(GlobalStateProperty.UserList)
    }

    public setUserList(userList: Employee[]) {
        this.store.setPropertyValue(GlobalStateProperty.UserList, userList)
    }

    public addUser(user: Employee) {
        const users = this.getUserList()
        users.push(user)
        this.setUserList(users)
    }

    public deleteUser(id: number) {
        const users = this.getUserList().filter(user => user.id != id)
        this.setUserList(users)
    }

    public isApplicationLoading(): boolean {
        return this.store.getPropertyValue(GlobalStateProperty.IsApplicationLoading)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.store.setPropertyValue(GlobalStateProperty.IsApplicationLoading, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.store.getPropertyValue(GlobalStateProperty.ShowDialog)
    }

    public setShowDialog(dialogType: DialogType): void {
        this.store.setPropertyValue(GlobalStateProperty.ShowDialog, dialogType)
    }

    public getEmployeeFirstName(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeFirstName)
    }

    public setEmployeeFirstName(value: string): void {
        this.store.setFieldValue(GlobalStateProperty.EditedEmployeeFirstName, value)
    }

    public getEmployeeMiddleName(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeMiddleName)
    }

    public setEmployeeMiddleName(value: string): void {
        this.store.setFieldValue(GlobalStateProperty.EditedEmployeeMiddleName, value)
    }

    public getEmployeeLastName(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeLastName)
    }

    public setEmployeeLastName(value: string): void {
        this.store.setFieldValue(GlobalStateProperty.EditedEmployeeLastName, value)
    }
}
