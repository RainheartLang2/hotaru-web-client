import AdminApplicationState, {AdminAppStateProperty} from "../components/AdminApplicationState";
import {sendGetRequestToServer} from "../../core/utils/HttpUtils";
import {GET_ALL_EMPLOYEES} from "../../common/backApplication/ServerAppUrl";
import {plainToClass} from "class-transformer";
import {Employee} from "../../common/beans/Employee";

export default class AdminAppController {
    private static INSTANCE: AdminAppController = new AdminAppController()

    private constructor () {}

    public static getInstance(): AdminAppController {
        return AdminAppController.INSTANCE
    }

    public startApplication(): void {
        this.loadUsersList()
    }

    public loadUsersList(): void {
        sendGetRequestToServer(GET_ALL_EMPLOYEES).then(response => {
            response.json().then(result => {
                this.getApplicationState().setUserList(plainToClass(Employee, result) as Employee[])
            })
        })
    }

    public subscribe(property: AdminAppStateProperty, component: React.Component) {
        this.getApplicationState().subscribe(property, component)
    }

    private getApplicationState(): AdminApplicationState {
        return AdminApplicationState.getInstance()
    }
}