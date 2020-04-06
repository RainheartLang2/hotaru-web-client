import AdminApplicationState from "../components/AdminApplicationState";
import {sendGetRequestToServer} from "../../core/utils/HttpUtils";
import {GET_ALL_EMPLOYEES} from "../../common/backApplication/ServerAppUrl";
import {plainToClass} from "class-transformer";
import {Employee} from "../../common/beans/Employee";

export default class AdminAppController {
    private static INSTANCE: AdminAppController = new AdminAppController()

    private constructor() {}

    public static getInstance(): AdminAppController {
        return AdminAppController.INSTANCE
    }

    public startApplication(): void {
        this.getApplicationState().setApplicationLoading(true)
        this.loadUsersList(() => this.getApplicationState().setApplicationLoading(false))
    }

    public loadUsersList(callback: Function): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(response => {
            response.json().then(result => {
                this.getApplicationState().setUserList(plainToClass(Employee, result) as Employee[])
                callback()
            })
        })
    }

    public subscribe(property: string, component: React.Component, propertyAlias: string = property) {
        this.getApplicationState().subscribe(property, component, propertyAlias)
    }

    private getApplicationState(): AdminApplicationState {
        return AdminApplicationState.getInstance()
    }
}