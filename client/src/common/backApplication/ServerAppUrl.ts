import {ServerAppAction, ServerAppService, ServerAppUrl, GetMethod, PostMethod} from "../../core/http/ServerAppUrl";

//Back application services list
const EMPLOYEES_SERVICE = new ServerAppService("/employees")

//Back application typical actions list
const GET_ALL_ACTION = new ServerAppAction("/all")
const ADD_ACTION = new ServerAppAction("/add")

//Back application concrete services urls
export const GET_ALL_EMPLOYEES = new ServerAppUrl<GetMethod>(EMPLOYEES_SERVICE, GET_ALL_ACTION)
export const ADD_EMPLOYEE = new ServerAppUrl<PostMethod>(EMPLOYEES_SERVICE, ADD_ACTION)