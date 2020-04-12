import {
    ServerAppAction,
    ServerAppService,
    ServerAppUrl,
    GetMethod,
    PostMethod,
    DeleteMethod
} from "../../core/http/ServerAppUrl";

export namespace ServerAppUrls {
    //Back application services list
    const employeeService = new ServerAppService("/employees")

    //Back application typical actions list
    const getAllAction = new ServerAppAction("/all")
    const addAction = new ServerAppAction("/add")
    const deleteAction = new ServerAppAction("/delete")

    //Back application concrete services urls
    export const getAllEmployees = new ServerAppUrl<GetMethod>(employeeService, getAllAction)
    export const addEmployee = new ServerAppUrl<PostMethod>(employeeService, addAction)
    export const deleteEmployee = new ServerAppUrl<DeleteMethod>(employeeService, deleteAction)
}