import AppState, {StateProperty} from "../../core/AppState";
import {Employee} from "../../common/beans/Employee";

export default class AdminApplicationState extends AppState<AdminAppStateProperty> {
    private static INSTANCE: AdminApplicationState

    private constructor() {
        const properties: AdminAppStateProperty[] = []
        properties.push(USER_LIST_PROPERTY)

        super(properties)
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
        return this.setPropertyValue(USER_LIST_PROPERTY, userList)
    }
}

export class AdminAppStateProperty implements StateProperty {
    private propertyName: string
    private defaultValue: any

    constructor(propertyName: string, defaultValue: any) {
        this.propertyName = propertyName
        this.defaultValue = defaultValue
    }

    getPropertyName(): string {
        return this.propertyName
    }

    getDefaultValue(): any {
        return this.defaultValue
    }
}

export const USER_LIST_PROPERTY_NAME = "userList"
export const USER_LIST_PROPERTY = new AdminAppStateProperty(USER_LIST_PROPERTY_NAME, [])