import AppState from "../../core/AppState";
import {Employee} from "../../common/beans/Employee";

export default class AdminApplicationState extends AppState {
    private static INSTANCE: AdminApplicationState

    private constructor() {
        super()
        this.registerProperty(USER_LIST_PROPERTY, [])
        this.registerProperty(IS_APPLICATION_LOADING_PROPERTY, true)
    }

    public static getInstance(): AdminApplicationState {
        if (!AdminApplicationState.INSTANCE) {
            AdminApplicationState.INSTANCE = new AdminApplicationState()
        }
        return AdminApplicationState.INSTANCE
    }

    public getUserList(): Employee[] {
        return this.getPropertyValue(USER_LIST_PROPERTY)
    }

    public setUserList(userList: Employee[]) {
        this.setPropertyValue(USER_LIST_PROPERTY, userList)
    }

    public isApplicationLoading(): boolean {
        return this.getPropertyValue(IS_APPLICATION_LOADING_PROPERTY)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.setPropertyValue(IS_APPLICATION_LOADING_PROPERTY, applicationLoading)
    }
}

export const USER_LIST_PROPERTY = "userList"
export const IS_APPLICATION_LOADING_PROPERTY = "isApplicationLoading"