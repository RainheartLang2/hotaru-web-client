import AdminAppController from "../AdminAppController";
import {fetchUserZoneRpc,} from "../../../core/utils/HttpUtils";
import {plainToClass} from "class-transformer";
import {Employee} from "../../../common/beans/Employee";
import {DialogType} from "../../state/enum/DialogType";
import EmployeeNode from "../../state/nodes/EmployeeNode";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {Clinic} from "../../../common/beans/Clinic";

export default class EmployeeActions {
    private controller: AdminAppController
    private node: EmployeeNode

    constructor(controller: AdminAppController,
                store: EmployeeNode) {
        this.controller = controller
        this.node = store
    }

    public loadUsersList(callback: (employees: Employee[]) => void = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllEmployees,
            successCallback: result => {
                this.node.setUserList(plainToClass(Employee, result) as Employee[])
                callback(result)
            },
        })
    }

    public openCreateEmployeeDialog(): void {
        this.controller.setShowDialog(DialogType.CreateEmployee)

        this.node.setEmployeeFirstName("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeFirstName, false)

        this.node.setEmployeeMiddleName("")

        this.node.setEmployeeLastName("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeLastName, false)

        this.node.setEmployeeActive(true)
        this.node.setEmployeePhone("")
        this.node.setEmployeeMail("")
        this.node.setEmployeeAddress("")
        this.node.setEmployeeClinic(Clinic.getMock())
        this.node.setEmployeeLogin("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeLogin, false)
        this.node.setEmployeePassword("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeePassword, false)
        this.node.setEmployeeConfirmPassword("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeConfirmPassword, false)
    }

    public openEditEmployeeDialog(user: Employee, editProfile: boolean = false): void {
        this.controller.setShowDialog(editProfile ? DialogType.EditEmployeeProfile : DialogType.EditEmployee)
        this.node.setEmployeeId(user.id ? user.id : 0)
        this.node.setEmployeeFirstName(user.firstName ? user.firstName : "")
        this.node.setEmployeeMiddleName(user.middleName ? user.middleName : "")
        this.node.setEmployeeLastName(user.lastName ? user.lastName : "")
        this.node.setEmployeeActive(user.active != null ? user.active : true)
        this.node.setEmployeePhone(user.phone != null ? user.phone : "")
        this.node.setEmployeeMail(user.email != null ? user.email : "")
        this.node.setEmployeeAddress(user.address != null ? user.address : "")
        this.node.setEmployeeClinic(user.clinicId ? this.controller.clinicActions.getClinicById(user.clinicId) : Clinic.getMock())
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeLogin, false)
        this.node.setEmployeePassword("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeePassword, false)
        this.node.setEmployeeConfirmPassword("")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedEmployeeConfirmPassword, false)
    }

    public setEmployeeActive(value: boolean): void {
        this.node.setEmployeeActive(value)
    }

    public setChangePassword(value: boolean): void {
        this.node.setEmployeeChangePassword(value)
    }

    public submitCreateEmployeeForm(): void {
        const employee = this.node.buildEmployeeBasedOnFields()
        const login = this.node.buildLoginBasedOnFields()
        this.controller.setDialogButtonLoading(true)
        fetchUserZoneRpc({
            method: RemoteMethods.addEmployee,
            params: [employee, login],
            successCallback: (result) => {
                employee.id = +result
                this.node.addUser(employee)
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public submitEditEmployeeForm(): void {
        this.controller.setDialogButtonLoading(true)
        fetchUserZoneRpc({
            method: RemoteMethods.editEmployee,
            params: [
                this.node.buildEmployeeBasedOnFields(),
                this.node.isEmployeeChangePassword()
                    ? this.node.buildLoginBasedOnFields()
                    : null,
            ],
            successCallback: (result) => {
                this.node.updateUser(this.node.buildEmployeeBasedOnFields())
                if (this.node.getEmployeeId() == this.controller.getLoggedInUser().id) {
                    this.controller.setLoggedInUser(this.node.buildEmployeeBasedOnFields())
                }
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public deleteEmployee(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteEmployee,
            params: [id],
            successCallback: (result) => this.node.deleteUser(id),
        })
    }
}