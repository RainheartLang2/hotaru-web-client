import {DialogType} from "../DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {Employee} from "../../../common/beans/Employee";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {AdminStateProperty} from "../AdminApplicationState";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";
import OnlyDigitsValidator from "../../../core/mvc/validators/OnlyDigitsValidator";
import ConfirmPasswordValidator from "../../../core/mvc/validators/ConfirmPasswordValidator";
import {Login} from "../../../common/beans/Login";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Clinic} from "../../../common/beans/Clinic";

export default class EmployeeNode {
    private store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(AdminStateProperty.UserList, [])
        this.store.registerSelector(AdminStateProperty.UserListById, {
            dependsOn: [AdminStateProperty.UserList],
            get: map => {
                const userList: Employee[] = map.get(AdminStateProperty.UserList) as Employee[]
                return CollectionUtils.mapArrayByPredicate(userList, employee => employee.id)
            }
        })

        this.store.registerSelector(AdminStateProperty.EmployeeDialogType, {
            dependsOn: [AdminStateProperty.DialogType],
            get: map => {
                const globalDialogType: DialogType = map.get(AdminStateProperty.DialogType)
                switch (globalDialogType) {
                    case DialogType.CreateEmployee:
                        return "create"
                    case DialogType.EditEmployee:
                        return "edit"
                    case DialogType.EditEmployeeProfile:
                        return "profile"
                    default:
                        return "none"
                }
            }
        })

        this.store.registerProperty(AdminStateProperty.EditedEmployeeId, 0)
        this.store.registerField(AdminStateProperty.EditedEmployeeFirstName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedEmployeeMiddleName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedEmployeeLastName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedEmployeePhone, "",
            [new MaximalLengthValidator(15),
                new OnlyDigitsValidator()])
        this.store.registerField(AdminStateProperty.EditedEmployeeEmail, "",
            [new MaximalLengthValidator(254),
                new EmailFormatValidator()])
        this.store.registerField(AdminStateProperty.EditedEmployeeAddress, "", [new MaximalLengthValidator(2048)])

        this.store.registerProperty(AdminStateProperty.EditedEmployeeClinic, null)

        this.store.registerProperty(AdminStateProperty.EditedEmployeeActive, Clinic.getMock())

        this.store.registerProperty(AdminStateProperty.IsEmployeeChangePassword, false)

        this.store.registerSelector(AdminStateProperty.IsChangePasswordButtonShow, {
            dependsOn: [AdminStateProperty.DialogType],
            get: (map: Map<string, any>) => {
                return this.getShowDialog() === DialogType.EditEmployee
                    || this.getShowDialog() === DialogType.EditEmployeeProfile
            }
        })

        this.store.registerSelector(AdminStateProperty.IsChangePasswordObligatory, {
            dependsOn: [AdminStateProperty.DialogType, AdminStateProperty.IsEmployeeChangePassword],
            get: (map: Map<string, any>) => {
                return this.getShowDialog() === DialogType.CreateEmployee || this.isEmployeeChangePassword()
            }
        })

        this.store.registerField(AdminStateProperty.EditedEmployeeLogin, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory())])
        this.store.registerField(AdminStateProperty.EditedEmployeePassword, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory())])
        this.store.registerField(AdminStateProperty.EditedEmployeeConfirmPassword, "",
            [new RequiredFieldValidator(() => this.isChangePasswordObligatory()),
                new ConfirmPasswordValidator(() => this.getEmployeePassword())])

        this.store.registerSelector(AdminStateProperty.EditEmployeeFormHasErrors,
            {
                dependsOn: [AdminStateProperty.EditedEmployeeFirstName,
                    AdminStateProperty.EditedEmployeeMiddleName,
                    AdminStateProperty.EditedEmployeeLastName,
                    AdminStateProperty.EditedEmployeeEmail,
                    AdminStateProperty.EditedEmployeePhone,
                    AdminStateProperty.EditedEmployeeLogin,
                    AdminStateProperty.EditedEmployeePassword,
                    AdminStateProperty.EditedEmployeeConfirmPassword,
                ],
                get: (map: Map<string, any>) => {
                    return !this.store.fieldsHaveNoErrors([AdminStateProperty.EditedEmployeeFirstName,
                        AdminStateProperty.EditedEmployeeMiddleName,
                        AdminStateProperty.EditedEmployeeLastName,
                        AdminStateProperty.EditedEmployeePhone,
                        AdminStateProperty.EditedEmployeeEmail,
                        AdminStateProperty.EditedEmployeeLogin,
                        AdminStateProperty.EditedEmployeePassword,
                        AdminStateProperty.EditedEmployeeConfirmPassword,
                    ])
                }
            })
    }

    public getUserList(): Employee[] {
        return this.store.getPropertyValue(AdminStateProperty.UserList)
    }

    public getUserListById(): Map<number, Employee> {
        return this.store.getPropertyValue(AdminStateProperty.UserListById)
    }

    public getUserById(id: number): Employee {
        const user = this.getUserListById().get(id)
        if (!user) {
            throw new Error("user with id " + id + " is not presented in the store")
        }
        return user
    }

    public setUserList(userList: Employee[]) {
        this.store.setPropertyValue(AdminStateProperty.UserList, userList)
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
        return this.store.getPropertyValue(AdminStateProperty.IsApplicationLoading)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.store.setPropertyValue(AdminStateProperty.IsApplicationLoading, applicationLoading)
    }

    public getShowDialog(): DialogType {
        return this.store.getPropertyValue(AdminStateProperty.DialogType)
    }

    public getEditedEmployee(): Employee {
        return this.getUserById(this.getEmployeeId())
    }

    public getEmployeeId(): number {
        return this.store.getPropertyValue<number>(AdminStateProperty.EditedEmployeeId)
    }

    public setEmployeeId(id: number): void {
        this.store.setPropertyValue<number>(AdminStateProperty.EditedEmployeeId, id)
    }

    public getEmployeeFirstName(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeFirstName)
    }

    public setEmployeeFirstName(value: string): void {
        this.store.setFieldValue(AdminStateProperty.EditedEmployeeFirstName, value)
    }

    public getEmployeeMiddleName(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeMiddleName)
    }

    public setEmployeeMiddleName(value: string): void {
        this.store.setFieldValue(AdminStateProperty.EditedEmployeeMiddleName, value)
    }

    public getEmployeeLastName(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeLastName)
    }

    public setEmployeeLastName(value: string): void {
        this.store.setFieldValue(AdminStateProperty.EditedEmployeeLastName, value)
    }

    public isEmployeeActive(): boolean {
        return this.store.getPropertyValue<boolean>(AdminStateProperty.EditedEmployeeActive)
    }

    public setEmployeeActive(value: boolean): void {
        this.store.setPropertyValue<boolean>(AdminStateProperty.EditedEmployeeActive, value)
    }

    public getEmployeePhone(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeePhone)
    }

    public setEmployeePhone(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeePhone, value)
    }

    public getEmployeeMail(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeEmail)
    }

    public setEmployeeMail(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeeEmail, value)
    }

    public getEmployeeAddress(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeAddress)
    }

    public setEmployeeAddress(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeeAddress, value)
    }

    public getEmployeeLogin(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeLogin)
    }

    public setEmployeeLogin(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeeLogin, value)
    }

    public getEmployeePassword(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeePassword)
    }

    public setEmployeePassword(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeePassword, value)
    }

    public getEmployeeConfirmPassword(): string {
        return this.store.getFieldValue<string>(AdminStateProperty.EditedEmployeeConfirmPassword)
    }

    public setEmployeeConfirmPassword(value: string): void {
        this.store.setFieldValue<string>(AdminStateProperty.EditedEmployeeConfirmPassword, value)
    }

    public isEmployeeChangePassword(): boolean {
        return this.store.getPropertyValue<boolean>(AdminStateProperty.IsEmployeeChangePassword)
    }

    public setEmployeeChangePassword(value: boolean): void {
        this.store.setPropertyValue<boolean>(AdminStateProperty.IsEmployeeChangePassword, value)
    }

    public isChangePasswordObligatory(): boolean {
        return this.store.getPropertyValue<boolean>(AdminStateProperty.IsChangePasswordObligatory)
    }

    public getEmployeeClinic(): Clinic {
        return this.store.getPropertyValue<Clinic>(AdminStateProperty.EditedEmployeeClinic)
    }

    public setEmployeeClinic(value: Clinic): void {
        this.store.setPropertyValue<Clinic>(AdminStateProperty.EditedEmployeeClinic, value)
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
            clinicId: this.getEmployeeClinic().id,
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
            return (this.getShowDialog() == DialogType.EditEmployee || this.getShowDialog() == DialogType.EditEmployeeProfile)
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
