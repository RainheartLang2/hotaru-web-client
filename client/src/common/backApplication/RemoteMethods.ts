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
    const speciesService = new ServerAppService("SpeciesService")
    const breedService = new ServerAppService("BreedService")
    const appointmentService = new ServerAppService("AppointmentService")

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
    export const addClinic = new RemoteMethod(clinicService, addAction)
    export const editClinic = new RemoteMethod(clinicService, editAction)
    export const deleteClinic = new RemoteMethod(clinicService, deleteAction)

    export const getAllSpecies = new RemoteMethod(speciesService, getAllAction)
    export const addSpecies = new RemoteMethod(speciesService, addAction)
    export const editSpecies = new RemoteMethod(speciesService, editAction)
    export const deleteSpecies = new RemoteMethod(speciesService, deleteAction)

    export const getAllBreeds = new RemoteMethod(breedService, getAllAction)
    export const addBreed = new RemoteMethod(breedService, addAction)
    export const editBreed = new RemoteMethod(breedService, editAction)
    export const deleteBreed = new RemoteMethod(breedService, deleteAction)

    export const getAllAppointments = new RemoteMethod(appointmentService, getAllAction)
    export const addAppointment = new RemoteMethod(appointmentService, addAction)
    export const editAppointment = new RemoteMethod(appointmentService, editAction)
    export const deleteAppointment = new RemoteMethod(appointmentService, deleteAction)

    export const getUserProfile = new RemoteMethod(userProfileService, getProfile)

    export const employeeLogin = new RemoteMethod(loginService, loginAction)
    export const employeeLogout = new RemoteMethod(loginService, logoutAction)
}