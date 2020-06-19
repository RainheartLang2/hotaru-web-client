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
    const clientService = new ServerAppService("ClientService")
    const measureService = new ServerAppService("MeasureService")
    const visitResultService = new ServerAppService("VisitResultService")
    const visitPurposeService = new ServerAppService("VisitPurposeService")
    const diagnosisService = new ServerAppService("DiagnosisService")
    const animalColorService = new ServerAppService("AnimalColorService")
    const clinicWorkScheduleService = new ServerAppService("ClinicWorkScheduleService")
    const employeeWorkScheduleService = new ServerAppService("EmployeeWorkScheduleService")

    //Back application typical actions list
    const getAllAction = new ServerAppAction("getAll")
    const addAction = new ServerAppAction("add")
    const editAction = new ServerAppAction("update")
    const deleteAction = new ServerAppAction("delete")
    const loginAction = new ServerAppAction("login")
    const logoutAction = new ServerAppAction("logout")
    const getProfile = new ServerAppAction("getProfile")
    const updateDates = new ServerAppAction("updateDates")

    //Back application concrete services urls
    export const getAllEmployees = new RemoteMethod(employeeService, getAllAction)
    export const addEmployee = new RemoteMethod(employeeService, addAction)
    export const editEmployee = new RemoteMethod(employeeService, editAction)
    export const deleteEmployee = new RemoteMethod(employeeService, deleteAction)

    export const getAllClinics = new RemoteMethod(clinicService, getAllAction)
    export const addClinic = new RemoteMethod(clinicService, addAction)
    export const editClinic = new RemoteMethod(clinicService, editAction)
    export const deleteClinic = new RemoteMethod(clinicService, deleteAction)

    export const getAllMeasure = new RemoteMethod(measureService, getAllAction)
    export const addMeasure = new RemoteMethod(measureService, addAction)
    export const editMeasure = new RemoteMethod(measureService, editAction)
    export const deleteMeasure = new RemoteMethod(measureService, deleteAction)

    export const getAllVisitResults = new RemoteMethod(visitResultService, getAllAction)
    export const addVisitResult = new RemoteMethod(visitResultService, addAction)
    export const editVisitResult = new RemoteMethod(visitResultService, editAction)
    export const deleteVisitResult = new RemoteMethod(visitResultService, deleteAction)

    export const getAllVisitPurposes = new RemoteMethod(visitPurposeService, getAllAction)
    export const addVisitPurpose = new RemoteMethod(visitPurposeService, addAction)
    export const editVisitPurpose = new RemoteMethod(visitPurposeService, editAction)
    export const deleteVisitPurpose = new RemoteMethod(visitPurposeService, deleteAction)
    
    export const getAllSpecies = new RemoteMethod(speciesService, getAllAction)
    export const addSpecies = new RemoteMethod(speciesService, addAction)
    export const editSpecies = new RemoteMethod(speciesService, editAction)
    export const deleteSpecies = new RemoteMethod(speciesService, deleteAction)

    export const getAllBreeds = new RemoteMethod(breedService, getAllAction)
    export const addBreed = new RemoteMethod(breedService, addAction)
    export const editBreed = new RemoteMethod(breedService, editAction)
    export const deleteBreed = new RemoteMethod(breedService, deleteAction)

    export const getAllDiagnosis = new RemoteMethod(diagnosisService, getAllAction)
    export const addDiagnosis = new RemoteMethod(diagnosisService, addAction)
    export const editDiagnosis = new RemoteMethod(diagnosisService, editAction)
    export const deleteDiagnosis = new RemoteMethod(diagnosisService, deleteAction)

    export const getAllAnimalColors = new RemoteMethod(animalColorService, getAllAction)
    export const addAnimalColor = new RemoteMethod(animalColorService, addAction)
    export const editAnimalColor = new RemoteMethod(animalColorService, editAction)
    export const deleteAnimalColor = new RemoteMethod(animalColorService, deleteAction)

    export const getAllAppointments = new RemoteMethod(appointmentService, getAllAction)
    export const addAppointment = new RemoteMethod(appointmentService, addAction)
    export const editAppointment = new RemoteMethod(appointmentService, editAction)
    export const updateAppointmentDates = new RemoteMethod(appointmentService, updateDates)
    export const deleteAppointment = new RemoteMethod(appointmentService, deleteAction)

    export const getAllClients = new RemoteMethod(clientService, getAllAction)
    export const getPermanentClients = new RemoteMethod(clientService, new ServerAppAction("getAllPermanent"))
    export const addClient = new RemoteMethod(clientService, addAction)
    export const editClient = new RemoteMethod(clientService, editAction)
    export const deleteClient = new RemoteMethod(clientService, deleteAction)

    export const getAllClinicWorkSchedules = new RemoteMethod(clinicWorkScheduleService, getAllAction)
    export const editClinicWorkSchedule = new RemoteMethod(clinicWorkScheduleService, editAction)
    export const setUsesDefaultSchedule = new RemoteMethod(clinicWorkScheduleService, new ServerAppAction("setUseDefaultFlag"))
    export const createClinicScheduleDeviation = new RemoteMethod(clinicWorkScheduleService, new ServerAppAction("createDeviation"))
    export const updateClinicScheduleDeviation = new RemoteMethod(clinicWorkScheduleService, new ServerAppAction("updateDeviation"))
    export const updateClinicScheduleDeviationDates = new RemoteMethod(clinicWorkScheduleService, new ServerAppAction("updateDeviationDates"))
    export const deleteClinicScheduleDeviation = new RemoteMethod(clinicWorkScheduleService, new ServerAppAction("deleteDeviation"))

    export const getAllEmployeeWorkSchedules = new RemoteMethod(employeeWorkScheduleService, getAllAction)
    export const editEmployeeWorkSchedule = new RemoteMethod(employeeWorkScheduleService, editAction)
    export const setUsesDefaultEmployeeSchedule = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("setUseDefaultFlag"))
    export const setEmployeeScheduleLength = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("setScheduleLength"))
    export const setEmployeeScheduleWeekly = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("setWeekly"))
    export const createEmployeeScheduleDeviation = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("createDeviation"))
    export const updateEmployeeScheduleDeviation = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("updateDeviation"))
    export const updateEmployeeScheduleDeviationDates = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("updateDeviationDates"))
    export const deleteEmployeeScheduleDeviation = new RemoteMethod(employeeWorkScheduleService, new ServerAppAction("deleteDeviation"))

    export const getUserProfile = new RemoteMethod(userProfileService, getProfile)

    export const employeeLogin = new RemoteMethod(loginService, loginAction)
    export const employeeLogout = new RemoteMethod(loginService, logoutAction)
}