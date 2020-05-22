import EmployeeAppController from "../EmployeeAppController";
import {Employee} from "../../../common/beans/Employee";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import {Clinic} from "../../../common/beans/Clinic";
import {Login} from "../../../common/beans/Login";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class EmployeeActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadUsersList(callback: (employees: Employee[]) => void = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllEmployees,
            successCallback: result => {
                this.controller.setState({userList: result})
                callback(result)
            },
        })
    }

    public openCreateEmployeeDialog(): void {
        this.controller.setState({
            dialogType: DialogType.CreateEmployee,
            editedEmployeeFirstName: "",
            editedEmployeeMiddleName: "",
            editedEmployeeLastName: "",
            editedEmployeeActive: true,
            editedEmployeePhone: "",
            editedEmployeeAddress: "",
            editedEmployeeClinic: Clinic.getMock(),
            editedEmployeeLogin: "",
            editedEmployeePassword: "",
            editedEmployeeConfirmPassword: "",
        })
        this.controller.toggleFieldValidation("editedEmployeeFirstNameField", false)
        this.controller.toggleFieldValidation("editedEmployeeMiddleNameField", false)
        this.controller.toggleFieldValidation("editedEmployeeLastNameField", false)
        this.controller.toggleFieldValidation("editedEmployeeLoginField", false)
        this.controller.toggleFieldValidation("editedEmployeePasswordField", false)
        this.controller.toggleFieldValidation("editedEmployeeConfirmPasswordField", false)
    }

    public openEditEmployeeDialog(user: Employee, editProfile: boolean = false): void {
        this.controller.setState({
            dialogType: DialogType.EditEmployee,
            editedEmployeeId: user.id,
            editedEmployeeFirstName: user.firstName,
            editedEmployeeMiddleName: user.middleName,
            editedEmployeeLastName: user.lastName,
            editedEmployeeActive: user.active,
            editedEmployeePhone: user.phone,
            editedEmployeeAddress: user.address,
            editedEmployeeClinic: user.clinicId ? this.controller.state.clinicListById.get(user.clinicId) : Clinic.getMock(),
            editedEmployeeLogin: "",
            editedEmployeePassword: "",
            editedEmployeeConfirmPassword: "",
        })
        this.controller.toggleFieldValidation("editedEmployeeLoginField", false)
        this.controller.toggleFieldValidation("editedEmployeePasswordField", false)
        this.controller.toggleFieldValidation("editedEmployeeConfirmPasswordField", false)
    }

    public buildEmployeeByFields(): Employee {
        const state = this.controller.state
        return {
            id: state.editedEmployeeId,
            firstName: state.editedEmployeeFirstName,
            middleName: state.editedEmployeeMiddleName,
            lastName: state.editedEmployeeLastName,
            active: state.editedEmployeeActive,
            phone: state.editedEmployeePhone,
            email: state.editedEmployeeMail,
            address: state.editedEmployeeAddress,
            clinicId: state.editedEmployeeClinic == Clinic.getMock() ? undefined : state.editedEmployeeClinic.id
        }
    }

    public buildLoginByFields(): Login {
        const state = this.controller.state
        return {
            loginName: state.editedEmployeeLogin,
            password: state.editedEmployeePassword,
        }
    }

    public submitCreateEmployeeForm(): void {
        const employee = this.buildEmployeeByFields()
        const login = this.buildLoginByFields()
        this.controller.setDialogButtonLoading(true)
        fetchUserZoneRpc({
            method: RemoteMethods.addEmployee,
            params: [employee, login],
            successCallback: (result) => {
                employee.id = +result
                this.controller.setState({
                    userList: [...this.controller.state.userList, employee]
                })
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    private updateUser(user: Employee): void {
        this.controller.setState({
            userList: CollectionUtils.updateArray(this.controller.state.userList,
                user,
                employee => employee.id)
        })
    }

    public submitEditEmployeeForm(): void {
        this.controller.setDialogButtonLoading(true)
        fetchUserZoneRpc({
            method: RemoteMethods.editEmployee,
            params: [
                this.buildEmployeeByFields(),
                this.controller.state.isEditedEmployeePasswordChanged
                    ? this.buildLoginByFields()
                    : null,
            ],
            successCallback: (result) => {
                const user = this.buildEmployeeByFields()
                this.updateUser(user)
                const loggedInEmployee = this.controller.state.loggedInEmployee
                if (loggedInEmployee != null && this.controller.state.editedEmployeeId == loggedInEmployee.id) {
                    this.controller.setState({
                        loggedInEmployee: user,
                    })
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
            successCallback: (result) => {
                this.controller.setState({
                    userList: this.controller.state.userList.filter(user => user.id != id)
                })
            },
        })
    }
}