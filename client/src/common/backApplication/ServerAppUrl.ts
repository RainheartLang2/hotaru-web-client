import {ServerAppAction, ServerAppService, ServerAppUrl, GetMethod} from "../../core/http/ServerAppUrl";

//Back application services list
const EMPLOYEES_SERVICE = new ServerAppService("/employees")

//Back application typical actions list
const GET_ALL_ACTION = new ServerAppAction("/all")

//Back application concrete services urls
export const GET_ALL_EMPLOYEES = new ServerAppUrl<GetMethod>(EMPLOYEES_SERVICE, GET_ALL_ACTION)