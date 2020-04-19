import {DialogType} from "../DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {Employee} from "../../../common/beans/Employee";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {GlobalStateProperty} from "../AdminApplicationState";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";
import OnlyDigitsValidator from "../../../core/mvc/validators/OnlyDigitsValidator";
import ConfirmPasswordValidator from "../../../core/mvc/validators/ConfirmPasswordValidator";
import {Login} from "../../../common/beans/Login";

export default class EmployeeNode {
    private store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(GlobalStateProperty.UserList, [])
        this.store.registerSelector(GlobalStateProperty.UserListById, {
            dependsOn: [GlobalStateProperty.UserList],
            get: map => {
                const userList: Employee[] = map.get(GlobalStateProperty.UserList) as Employee[]
                const result = new Map<number, Employee>()
                userList.forEach(user => {
                    if (!user.id) {
                        throw new Error("user without id should not be in the store")
                    }
                    result.set(user.id, user)
                })

                return result
            }
        })

        this.store.registerSelector(GlobalStateProperty.EmployeeDialogType, {
            dependsOn: [GlobalStateProperty.ShowDialog],
            get: map => {
                const globalDialogType: DialogType = map.get(GlobalStateProperty.ShowDialog)
                switch (globalDialogType) {
                    case DialogType.CreateEmployee:
                        return "create"
                    case DialogType.EditEmployee:
                        return "edit"
                    default:
                        return "none"
                }
            }
        })

        this.store.registerProperty(GlobalStateProperty.EditedEmployeeId, 0)
        this.store.registerField(GlobalStateProperty.EditedEmployeeFirstName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(GlobalStateProperty.EditedEmployeeMiddleName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(GlobalStateProperty.EditedEmployeeLastName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(GlobalStateProperty.EditedEmployeePhone, "",
            [new MaximalLengthValidator(15),
                new OnlyDigitsValidator()])
        this.store.registerField(GlobalStateProperty.EditedEmployeeEmail, "",
            [new MaximalLengthValidator(254),
                new EmailFormatValidator()])
        this.store.registerField(GlobalStateProperty.EditedEmployeeAddress, "", [new MaximalLengthValidator(2048)])

        this.store.registerProperty(GlobalStateProperty.EditedEmployeeActive, true)

        this.store.registerProperty(GlobalStateProperty.IsEmployeeChangePassword, false)

        this.store.registerSelector(GlobalStateProperty.IsChangePasswordButtonShow, {
            dependsOn: [GlobalStateProperty.ShowDialog],
            get: (map: Map<string, any>) => {
                return this.getShowDialog() === DialogType.EditEmployee
            }
        })

        this.store.registerSelector(GlobalStateProperty.IsChangePasswordObligatory, {
            dependsOn: [GlobalStateProperty.ShowDialog, GlobalStateProperty.IsEmployeeChangePassword],
            get: (map: Map<string, any>) => {
                return this.getShowDialog() === DialogType.CreateEmployee || this.isEmployeeChangePassword()
            }
        })

        this.store.registerField(GlobalStateProperty.EditedEmployeeLogin, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory())])
        this.store.registerField(GlobalStateProperty.EditedEmployeePassword, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory())])
        this.store.registerField(GlobalStateProperty.EditedEmployeeConfirmPassword, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory()),
                new ConfirmPasswordValidator(() => this.getEmployeePassword())])

        this.store.registerSelector(GlobalStateProperty.EditEmployeeFormHasErrors,
            {
                dependsOn: [GlobalStateProperty.EditedEmployeeFirstName,
                    GlobalStateProperty.EditedEmployeeMiddleName,
                    GlobalStateProperty.EditedEmployeeLastName,
                    GlobalStateProperty.EditedEmployeeEmail,
                    GlobalStateProperty.EditedEmployeePhone,
                    GlobalStateProperty.EditedEmployeeLogin,
                    GlobalStateProperty.EditedEmployeePassword,
                    GlobalStateProperty.EditedEmployeeConfirmPassword,
                ],
                get: (map: Map<string, any>) => {
                    return !this.store.fieldsHaveNoErrors([GlobalStateProperty.EditedEmployeeFirstName,
                        GlobalStateProperty.EditedEmployeeMiddleName,
                        GlobalStateProperty.EditedEmployeeLastName,
                        GlobalStateProperty.EditedEmployeePhone,
                        GlobalStateProperty.EditedEmployeeEmail,
                        GlobalStateProperty.EditedEmployeeLogin,
                        GlobalStateProperty.EditedEmployeePassword,
                        GlobalStateProperty.EditedEmployeeConfirmPassword,
                    ])
                }
            })
    }

    public getUserList(): Employee[] {
        return this.store.getPropertyValue(GlobalStateProperty.UserList)
    }

    public getUserListById(): Map<number, Employee> {
        return this.store.getPropertyValue(GlobalStateProperty.UserListById)
    }

    public getUserById(id: number): Employee {
        const user = this.getUserListById().get(id)
        if (!user) {
            throw new Error("user with id " + id + " is not presented in the store")
        }
        return user
    }

    public setUserList(userList: Employee[]) {
        this.store.setPropertyValue(GlobalStateProperty.UserList, userList)
    }

    public addUser(user: Employee) {
        const users = this.getUserList()
        users.push(user)
        this.setUserList(users)
    }

    public updateUser(updatedUser: Employee) {
        const userList = this.getUserList().map(user => user.id == updatedUser.id ? updatedUser : user)
        this.setUserList(userList)
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

    public getEditedEmployee(): Employee {
        return this.getUserById(this.getEmployeeId())
    }

    public getEmployeeId(): number {
        return this.store.getPropertyValue<number>(GlobalStateProperty.EditedEmployeeId)
    }

    public setEmployeeId(id: number): void {
        this.store.setPropertyValue<number>(GlobalStateProperty.EditedEmployeeId, id)
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

    public isEmployeeActive(): boolean {
        return this.store.getPropertyValue<boolean>(GlobalStateProperty.EditedEmployeeActive)
    }

    public setEmployeeActive(value: boolean): void {
        this.store.setPropertyValue<boolean>(GlobalStateProperty.EditedEmployeeActive, value)
    }

    public getEmployeePhone(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeePhone)
    }

    public setEmployeePhone(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeePhone, value)
    }

    public getEmployeeMail(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeEmail)
    }

    public setEmployeeMail(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeeEmail, value)
    }

    public getEmployeeAddress(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeAddress)
    }

    public setEmployeeAddress(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeeAddress, value)
    }

    public getEmployeeLogin(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeLogin)
    }

    public setEmployeeLogin(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeeLogin, value)
    }

    public getEmployeePassword(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeePassword)
    }

    public setEmployeePassword(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeePassword, value)
    }

    public getEmployeeConfirmPassword(): string {
        return this.store.getFieldValue<string>(GlobalStateProperty.EditedEmployeeConfirmPassword)
    }

    public setEmployeeConfirmPassword(value: string): void {
        this.store.setFieldValue<string>(GlobalStateProperty.EditedEmployeeConfirmPassword, value)
    }

    public isEmployeeChangePassword(): boolean {
        return this.store.getPropertyValue<boolean>(GlobalStateProperty.IsEmployeeChangePassword)
    }

    public setEmployeeChangePassword(value: boolean): void {
        this.store.setPropertyValue<boolean>(GlobalStateProperty.IsEmployeeChangePassword, value)
    }

    public isChangePasswordObligatory(): boolean {
        return this.store.getPropertyValue<boolean>(GlobalStateProperty.IsChangePasswordObligatory)
    }

    public buildEmployeeBasedOnFields(): Employee {
        return {
            id: this.getEmployeeId(),
            firstName: this.getEmployeeFirstName(),
            middleName: this.getEmployeeMiddleName(),
            lastName: this.getEmployeeLastName(),
            active: this.isEmployeeActive(),
            phone: this.getEmployeePhone(),
            email: this.getEmployeeMail(),
            address: this.getEmployeeAddress(),
        }
    }

    public buildLoginBasedOnFields(): Login {
        return {
            loginName: this.getEmployeeLogin(),
            password: this.getEmployeePassword(),
        }
    }

    public isEmployeeFormChanged(): boolean {
        if (this.getShowDialog() == DialogType.CreateEmployee) {
            return this.getEmployeeFirstName() != ""
                || this.getEmployeeMiddleName() != ""
                || this.getEmployeeLastName() != ""
                || this.getEmployeePhone() != ""
                || this.getEmployeeMail() != ""
                || this.getEmployeeAddress() != ""
                || this.getEmployeeLogin() != ""
                || this.getEmployeePassword() != ""
        } else {
            const editedEmployee = this.getEditedEmployee()
            return this.getShowDialog() == DialogType.EditEmployee
                && (this.getEmployeeFirstName() != editedEmployee.firstName
                    || this.getEmployeeMiddleName() != editedEmployee.middleName
                    || this.getEmployeeLastName() != editedEmployee.lastName
                    || this.isEmployeeActive() != editedEmployee.active)
                || this.getEmployeePhone() != editedEmployee.phone
                || this.getEmployeeMail() != editedEmployee.email
                || this.getEmployeeAddress() != editedEmployee.address
        }
    }
}
