import {
    ServerAppAction,
    ServerAppService,
    RemoteMethod,
} from "../../core/http/RemoteMethod";

export namespace RemoteMethods {
    //Back application services list
    const employeeService = new ServerAppService("EmployeeService")
    const loginService = new ServerAppService("LoginService")
    const userProfileService = new ServerAppService("UserProfileService")
    const clinicService = new ServerAppService("ClinicService")

    //Back application typical actions list
    const getAllAction = new ServerAppAction("getAll")
    const addAction = new ServerAppAction("add")
    const editAction = new ServerAppAction("update")
    const deleteAction = new ServerAppAction("delete")
    const loginAction = new ServerAppAction("login")
    const logoutAction = new ServerAppAction("logout")
    const getProfile = new ServerAppAction("getProfile")

    //Back application concrete services urls
    export const getAllEmployees = new RemoteMethod(employeeService, getAllAction)
    export const addEmployee = new RemoteMethod(employeeService, addAction)
    export const editEmployee = new RemoteMethod(employeeService, editAction)
    export const deleteEmployee = new RemoteMethod(employeeService, deleteAction)

    export const getAllClinics = new RemoteMethod(clinicService, getAllAction)

    export const getUserProfile = new RemoteMethod(userProfileService, getProfile)

    export const employeeLogin = new RemoteMethod(loginService, loginAction)
    export const employeeLogout = new RemoteMethod(loginService, logoutAction)
}